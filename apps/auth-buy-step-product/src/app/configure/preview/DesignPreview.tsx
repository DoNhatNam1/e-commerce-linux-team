"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Confetti from "react-dom-confetti";

import { useRouter } from "next/navigation";

import { ArrowRight, Check, Edit } from "lucide-react";

import { Button } from "@e-com-linux-team/shadcn";
import { cn, formatPrice } from "@e-com-linux-team/shadcn";
import { useToast } from "@e-com-linux-team/shadcn";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { TbConfiguration } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import AddressFormModel from "../../../components/AddressFormModel";
import LoginModal from "../../../components/LoginModel";
import Phone from "../../../components/Phone";
import { COLORS, FINISHES, MODELS } from "../../../validators/option-validator";
import { BASE_PRICE, PRODUCT_PRICES } from "../.././../config/products";
import { createCheckoutSession } from "./actions";
import { Address } from "./types";

const DesignPreview = ({
  configuration,
}: {
  configuration: TbConfiguration;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = configuration;
  const { user } = useKindeBrowserClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [btnType, setBtnType] = useState<"Next" | "Checkout">("Next");
  const [isAddressFormModalOpen, setIsAddressFormModalOpen] =
    useState<boolean>(false);
  const [dataAddr, setDataAddr] = useState([]);

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  useEffect(() => setShowConfetti(true));

  const { color, model, finish, material } = configuration;

  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color,
  )?.tw;

  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model,
  )!;

  let totalPrice = BASE_PRICE;
  if (material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured;

  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) router.push(url);
      else throw new Error("Unable to retrieve payment URL.");
    },
    onError: () => {
      toast({
        title: "Có lỗi xảy ra",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (!user) {
      // need to log in
      localStorage.setItem("configurationId", id);
      setIsLoginModalOpen(true);
      return;
    }

    if (dataAddr.length > 0) {
      // create payment session
      createPaymentSession({ configId: id, dataAddr });
    } else {
      // handleOpenAddrForm
      setBtnType("Next");
      handleOpenAddrForm();
    }
  };

  const handleOpenAddrForm = () => {
    if (user) {
      setIsAddressFormModalOpen(true);
    } else {
      // need to log in
      localStorage.setItem("configurationId", id);
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none justify-center overflow-hidden"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90 }}
        />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <AddressFormModel
        isOpen={isAddressFormModalOpen}
        setIsOpen={setIsAddressFormModalOpen}
        setDataAddr={setDataAddr as Dispatch<SetStateAction<Address[]>>}
        setBtnType={setBtnType}
      />

      <div className="mt-20 flex flex-col items-center text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:grid md:gap-x-8 lg:gap-x-12">
        <div className="md:col-span-4 md:row-span-2 md:row-end-2 lg:col-span-3">
          <Phone
            className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")}
            imgSrc={configuration.croppedImageUrl!}
          />
        </div>

        <div className="mt-6 sm:col-span-9 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Vỏ {modelLabel} Của Bạn
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            Có sẵn và sẵn sàng để giao hàng
          </div>
        </div>

        <div className="text-base sm:col-span-12 md:col-span-9">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Điểm nổi bật</p>
              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>Sạc không dây</li>
                <li>TPU chống sốc</li>
                <li>Bao bì được làm từ nguyên liệu tái chế</li>
                <li>Bảo hành 5 năm</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Chất liệu</p>
              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>Chất liệu bền</li>
                <li>Chống trầy xước và vân tay</li>
              </ol>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="mt-2 flex items-center justify-between py-1">
                  <p className="text-gray-600">Giá cơ bản</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE / 100)}
                  </p>
                </div>

                {finish === "textured" ? (
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Hoàn thiện kết cấu</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                    </p>
                  </div>
                ) : null}

                {material === "polycarbonate" ? (
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Chất liệu polycarbonate mềm</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                    </p>
                  </div>
                ) : null}

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Tổng đơn hàng</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPrice / 100)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              {btnType === "Checkout" ? (
                <div className="flex gap-5">
                  <Button
                    onClick={() => handleOpenAddrForm()}
                    variant="outline"
                    className="px-4 sm:px-6 lg:px-8"
                  >
                    Sửa địa chỉ{" "}
                    <Edit className="ml-1.5 inline h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleCheckout()}
                    className="px-4 sm:px-6 lg:px-8"
                  >
                    Thanh toán <ArrowRight className="ml-1.5 inline h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleOpenAddrForm()}
                  className="px-4 sm:px-6 lg:px-8"
                >
                  Tiếp tục <ArrowRight className="ml-1.5 inline h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview;
