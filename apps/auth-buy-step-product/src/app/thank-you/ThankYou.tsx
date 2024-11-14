"use client";

import { useSearchParams } from "next/navigation";

import { ArrowRight, Loader2 } from "lucide-react";

import { Button, formatPrice } from "@e-com-linux-team/shadcn";
import { useQuery } from "@tanstack/react-query";

import PhonePreview from "../../components/PhonePreview";
import { getPaymentStatus, updateUserStatus } from "./actions";

const ThankYou = () => {
  const searchParams = useSearchParams();
  const app_trans_id = searchParams.get("apptransid") || "";

  const handleGoBackHomePage = () => {
    updateUserStatus()
  };

  const { data } = useQuery({
    queryKey: ["get-payment-status"],
    queryFn: async () => await getPaymentStatus({ app_trans_id }),
    retry: true,
    retryDelay: 500,
  });

  if (data === undefined) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="text-xl font-semibold">
            Đang cập nhập đơn hàng của bạn...
          </h3>
          <p>Sẽ nhanh thôi.</p>
        </div>
      </div>
    );
  }

  if (data === false) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="text-xl font-semibold">
            Xác thực hóa đơn thanh toán...
          </h3>
          <p>Có thể mất 1 lúc.</p>
        </div>
      </div>
    );
  }

  const { configuration, shippingAddress, amount } = data
  const { color } = configuration;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-primary text-base font-medium">Cảm ơn!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Vỏ ốp của bạn đang được giao!
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            Chúng tôi đã nhận được đơn của bạn và sẽ gửi cho bạn ngay.
          </p>

          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Mã đơn hàng</p>
            <p className="mt-2 text-zinc-500">{app_trans_id}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              Bạn đã có 1 quyết định sáng suốt!
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              Chúng tôi tại WeldingStore tin rằng một chiếc ốp lưng không chỉ
              cần đẹp mắt mà còn phải bền bỉ trong nhiều năm tới. Chúng tôi cung
              cấp bảo hành in ấn 5 năm. Nếu ốp lưng của bạn không đạt chất lượng
              cao nhất, chúng tôi sẽ thay thế miễn phí.
            </p>
          </div>
        </div>

        <div className="mt-4 flex space-x-6 overflow-hidden rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhonePreview
            croppedImageUrl={configuration.croppedImageUrl!}
            color={color!}
          />
        </div>

        <div>
          <div className='grid grid-cols-2 gap-x-6 py-10 text-sm'>
            <div>
              <p className='font-medium text-gray-900'>Địa chỉ giao hàng</p>
              <div className='mt-2 text-zinc-700'>
                <address className='not-italic'>
                  <span className='block'>{shippingAddress?.street}</span>
                  <span className='block'>
                    {shippingAddress?.postalCode} {shippingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Trạng thái đơn hàng</p>
              <p className="mt-2 text-zinc-700">Đã thanh toán</p>
            </div>

            <div>
              <p className="font-medium text-zinc-900">Trạng thái giao hàng</p>
              <p className="mt-2 text-zinc-700">
                DHL, sẽ mất khoảng 3 ngày để giao hàng
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Giá cơ bản</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Tiền ship</p>
            <p className="text-zinc-700">{formatPrice(0)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Tổng</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end pb-12">
          <Button
            onClick={() => handleGoBackHomePage()}
            className="px-4 sm:px-6 lg:px-8"
          >
            Về trang chủ <ArrowRight className="ml-1.5 inline h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
