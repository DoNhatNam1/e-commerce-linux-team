import type { Dispatch, SetStateAction } from "react";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@e-com-linux-team/shadcn";
import { buttonVariants } from "@e-com-linux-team/shadcn";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader>
          <div className="relative mx-auto mb-2 h-24 w-24">
            <Image
              src="/images/monkey-4.png"
              alt="hình ảnh con rắn"
              className="object-contain"
              fill
            />
          </div>
          <DialogTitle className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Đăng nhập để tiếp tục
          </DialogTitle>
          <DialogDescription className="py-2 text-center text-base">
            <span className="font-medium text-zinc-900">
              Cấu hình của bạn đã được lưu!
            </span>{" "}
            Vui lòng đăng nhập hoặc tạo tài khoản để hoàn tất giao dịch của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <LoginLink className={buttonVariants({ variant: "outline" })}>
            Đăng nhập
          </LoginLink>
          <RegisterLink className={buttonVariants({ variant: "default" })}>
            Đăng ký
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
