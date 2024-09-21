import { Dispatch, SetStateAction } from "react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from '@e-com-linux-team/shadcn';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema validation with Zod
const addressSchema = z.object({
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  country: z.string().min(1, "Vui lòng nhập quốc gia"),
  postalCode: z.string().min(1, "Vui lòng nhập mã bưu điện"),
  street: z.string().min(1, "Vui lòng nhập tên đường"),
  state: z.string().min(1, "Vui lòng nhập bang/tỉnh"),
});

type Address = z.infer<typeof addressSchema>;

const AddressFormModel = ({
  isOpen,
  setIsOpen,
  setDataAddr,
  setBtnType
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setDataAddr: Dispatch<SetStateAction<Address[]>>;
  setBtnType: Dispatch<SetStateAction<'Checkout' | 'Next'>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Address>({
    resolver: zodResolver(addressSchema), // Use zod for validation
  });

  const onSubmit = (data: Address) => {
    setDataAddr((prev) => [...prev, data]);
    setBtnType('Checkout');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nhập địa chỉ giao hàng</DialogTitle>
          <DialogDescription className="w-full text-center">
            Vui lòng xác nhận thông tin trước khi tiến hành thanh toán.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">
              Thành phố
            </Label>
            <Input
              id="city"
              className="col-span-3"
              {...register('city')}
            />
            {errors.city && <p className="col-span-4 text-red-500">{errors.city.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Quốc gia
            </Label>
            <Input
              id="country"
              className="col-span-3"
              {...register('country')}
            />
            {errors.country && <p className="col-span-4 text-red-500">{errors.country.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-right">
              Bang/Tỉnh
            </Label>
            <Input
              id="state"
              className="col-span-3"
              {...register('state')}
            />
            {errors.state && <p className="col-span-4 text-red-500">{errors.state.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="street" className="text-right">
              Tên đường
            </Label>
            <Input
              id="street"
              className="col-span-3"
              {...register('street')}
            />
            {errors.street && <p className="col-span-4 text-red-500">{errors.street.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="postalCode" className="text-right">
              Mã bưu điện
            </Label>
            <Input
              id="postalCode"
              className="col-span-3"
              {...register('postalCode')}
            />
            {errors.postalCode && <p className="col-span-4 text-red-500">{errors.postalCode.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormModel;
