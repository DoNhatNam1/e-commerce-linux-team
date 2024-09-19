import type { Dispatch, SetStateAction } from "react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from '@e-com-linux-team/shadcn';
import React, { useState } from 'react';

interface Address {
    city: string;
    country: string;
    postalCode: string;
    street: string;
    state: string;
}

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
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [street, setStreet] = useState('');
    const [state, setState] = useState('');

    const handleSubmitForm = () => {

        const address = {
            city,
            country, 
            postalCode,
            street,
            state
        };
        setDataAddr(prev => [...prev, address]);

        setBtnType('Checkout');
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nhập địa chỉ giao hàng</DialogTitle>
                    <DialogDescription>
                        Chỉ là để xác thực 1 số thông tin trước khi thanh toán
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="city" className="text-right">
                            Tên Thành phố
                        </Label>
                        <Input
                            id="city"
                            className="col-span-3"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="country" className="text-right">
                            Tên quốc gia
                        </Label>
                        <Input
                            id="country"
                            className="col-span-3"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="state" className="text-right">
                            Tên Bang/Tỉnh
                        </Label>
                        <Input
                            id="state"
                            className="col-span-3"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="street" className="text-right">
                            Tên đường
                        </Label>
                        <Input
                            id="street"
                            className="col-span-3"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="postalCode" className="text-right">
                            Mã cục bưu điện
                        </Label>
                        <Input
                            id="postalCode"
                            className="col-span-3"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        type="button" 
                        onClick={handleSubmitForm}
                    >
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddressFormModel;
