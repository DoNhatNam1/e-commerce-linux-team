"use server";

import { prisma as db } from "@e-com-linux-team/config";

export type SaveConfigArgs = {
  color: "black" | "blue" | "rose";
  finish: "smooth" | "textured";
  material: "silicone" | "polycarbonate";
  model:
    | "iphonex"
    | "iphone11"
    | "iphone12"
    | "iphone13"
    | "iphone14"
    | "iphone15";
  configId: string;
};

export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigArgs) {
  await db.tbConfiguration.update({
    where: { id: configId },
    data: { color, finish, material, model },
  });
}
