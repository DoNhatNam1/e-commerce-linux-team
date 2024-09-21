import { PrismaClient } from "@prisma/client";

declare global {
  var cachedPrisma: PrismaClient;
}

const configZalo = {
  app_id: process.env["APPID"],
  key1: process.env["KEY1"],
  key2: process.env["KEY2"],
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
  callback_url: `${process.env["ZLP_MERCHANT_CALLBACK_URL"]}/api/webhooks`,
};

let prisma: PrismaClient;
if (process.env["NODE_ENV"] === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }

  prisma = global.cachedPrisma;
}

export { configZalo, prisma };
