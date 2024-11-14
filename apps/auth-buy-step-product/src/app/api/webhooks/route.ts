import { NextResponse } from "next/server";

import CryptoJS from "crypto-js";
import { Resend } from "resend";

import { prisma as db } from "@e-com-linux-team/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import OrderReceivedEmail from "../../../components/emails/OrderReceivedEmail";

interface ZaloCallbackResponse {
  return_code: number;
  return_message: string;
  [key: string]: any;
}

const resend = new Resend(process.env.RESEND_API_KEY);

const configZalo = {
  app_id: `${process.env.APPID}`,
  key1: `${process.env.KEY1}`,
  key2: `${process.env.KEY2}`,
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
  callback_url: `${process.env.ZLP_MERCHANT_CALLBACK_URL}/api/webhooks`,
};

function extractOrderId(app_trans_id: string): { orderId: number } {
  const parts = app_trans_id.split("_");

  const orderIdPart = parts[1];

  const orderId = parseInt(orderIdPart, 10);

  return { orderId };
}



export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();



  let result: ZaloCallbackResponse = {
    return_code: 0,
    return_message: "",
  };
  const body = await req.json();

  console.log("body=", body);

  try {
    //@ts-ignore
    const dataStr = body.data;
    //@ts-ignore
    const reqMac = body.mac;
    // Calculate MAC using CryptoJS
    let mac = CryptoJS.HmacSHA256(dataStr, String(configZalo.key2)).toString(
      CryptoJS.enc.Hex,
    );

    // Check if the callback is valid
    if (reqMac !== mac) {
      // Invalid callback
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // Payment successful

      //@ts-ignore
      let dataJson = JSON.parse(dataStr, String(configZalo.key2));

      const app_trans_id = dataJson["app_trans_id"];

      const result = extractOrderId(app_trans_id);

      const temporaryAddress = await db.tbTemporaryAddress.findFirst({
        where: { orderId: result.orderId },
      });

      let shippingAddress;
      let updatedOrder;
       shippingAddress = await db.tbShippingAddress.findFirst({
        where: {
          city: temporaryAddress!.city,
          country: temporaryAddress!.country,
          postalCode: temporaryAddress!.postalCode,
          state: temporaryAddress!.postalCode,
          street: temporaryAddress!.street,
        },
      });

      if (!shippingAddress) {
        shippingAddress = await db.tbShippingAddress.create({
          data: {
            city: temporaryAddress!.city,
            country: temporaryAddress!.country,
            postalCode: temporaryAddress!.postalCode,
            state: temporaryAddress!.postalCode,
            street: temporaryAddress!.street,
          },
        });

        updatedOrder = await db.tbOrder.update({
          where: { id: result.orderId },
          data: { shippingAddressId: shippingAddress.id, isPaid: true },
        });

        await db.tbTemporaryAddress.delete({
          where: { orderId: updatedOrder.id },
        });
      } else {
        updatedOrder = await db.tbOrder.update({
          where: { id: result.orderId },
          data: { shippingAddressId: shippingAddress.id, isPaid: true },
        });
      }

      if (updatedOrder) {
        const findUserEmail = await db.tbUser.findFirst({
          where: { id: dataJson["app_user"] },
          select: {
            email: true,
          },
        });
        if (findUserEmail) {
          console.log("findUserEmail= ", findUserEmail);
          await resend.emails.send({
            from: "WeldingStore <namnhatvt2595@resend.dev>",
            to: [findUserEmail.email],
            subject: "Cảm ơn vì đơn hàng của bạn!",
            react: OrderReceivedEmail({
              orderId: dataJson["app_trans_id"],
              orderDate: updatedOrder.createdAt.toLocaleDateString(),
              // @ts-ignore
              shippingAddress: {
                city: shippingAddress!.city!,
                country: shippingAddress!.country!,
                postalCode: shippingAddress!.postalCode!,
                street: shippingAddress!.street!,
                state: shippingAddress!.state,
              },
            }),
          });
        }
      }
    }
    return NextResponse.json({ message: "Success", ok: true }, { status: 200 });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 },
    );
  }
}
