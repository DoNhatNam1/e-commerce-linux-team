"use server";

import { prisma as db } from "@e-com-linux-team/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TbOrder } from "@prisma/client";

import { BASE_PRICE, PRODUCT_PRICES } from "../../../config/products";
import { Address } from "./types";

export async function createCheckoutSession({
  configId,
  dataAddr
}: {
  configId: string;
  dataAddr: Address[];
}) {
  const configuration = await db.tbConfiguration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const { finish, material } = configuration;

  let price = BASE_PRICE;
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;

  let order: TbOrder | undefined = undefined;

  const existingOrder = await db.tbOrder.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });

  if (existingOrder) {
    let urlPayment;
    order = existingOrder;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYMENT_SERVER}/api/payment/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            userId: user.id,
            orderId: order.id,
            createAt: order.createdAt,
          },
          product: {
            name: "Trang trí vỏ ốp điện thoại",
            images: [configuration.imageUrl],
            default_price_data: {
              currency: "VND",
              unit_amount: order.amount,
            },
          },
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
        }),
      },
    );

    if (response) {
      urlPayment = await response.json();
      console.log('urlPayment= ', urlPayment)
    }

    return { url: urlPayment?.url };
  } else {
    console.log(configuration.imageUrl);
    order = await db.tbOrder.create({
      data: {
        amount: price / 100,
        userId: user.id,
        configurationId: configuration.id,
        temporaryaddress: {
          create: {
            city: dataAddr[0].city,
            street: dataAddr[0].street,
            postalCode: dataAddr[0].postalCode,
            state: dataAddr[0].state,
            country: dataAddr[0].country
          }
        }
      },
    });
    let urlPayment;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYMENT_SERVER}/api/payment/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            userId: user.id,
            orderId: order.id,
            createAt: order.createdAt,
          },
          product: {
            name: "Trang trí vỏ ốp điện thoại",
            images: [configuration.imageUrl],
            default_price_data: {
              currency: "VND",
              unit_amount: order.amount,
            },
          },
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
        }),
      },
    );

    if (response) {
      urlPayment = await response.json();
      console.log('urlPayment= ', urlPayment)
    }

    return { url: urlPayment?.url};
  }
}
