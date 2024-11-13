-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('fulfilled', 'shipped', 'awaiting_shipment');

-- CreateEnum
CREATE TYPE "PhoneModel" AS ENUM ('iphonex', 'iphone11', 'iphone12', 'iphone13', 'iphone14', 'iphone15');

-- CreateEnum
CREATE TYPE "CaseMaterial" AS ENUM ('silicone', 'polycarbonate');

-- CreateEnum
CREATE TYPE "CaseFinish" AS ENUM ('smooth', 'textured');

-- CreateEnum
CREATE TYPE "CaseColor" AS ENUM ('black', 'blue', 'rose');

-- CreateTable
CREATE TABLE "TbConfiguration" (
    "id" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "color" TEXT,
    "model" TEXT,
    "material" TEXT,
    "finish" TEXT,
    "croppedImageUrl" TEXT,

    CONSTRAINT "TbConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TbUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbOrder" (
    "id" SERIAL NOT NULL,
    "configurationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "status" "OrderStatus" NOT NULL DEFAULT 'awaiting_shipment',
    "shippingAddressId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TbOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbTemporaryAddress" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "TbTemporaryAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbShippingAddress" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "phoneNumber" TEXT,

    CONSTRAINT "TbShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TbTemporaryAddress_orderId_key" ON "TbTemporaryAddress"("orderId");

-- AddForeignKey
ALTER TABLE "TbOrder" ADD CONSTRAINT "TbOrder_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "TbConfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbOrder" ADD CONSTRAINT "TbOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TbUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbOrder" ADD CONSTRAINT "TbOrder_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "TbShippingAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbTemporaryAddress" ADD CONSTRAINT "TbTemporaryAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "TbOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
