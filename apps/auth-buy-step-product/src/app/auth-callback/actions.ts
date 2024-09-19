"use server";

import { prisma as db } from "@e-com-linux-team/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getAuthStatus = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    throw new Error("Invalid user data");
  }

  const existingUser = await db.tbUser.findFirst({
    where: { id: user.id },
  });

  if (!existingUser) {
    await db.tbUser.create({
      data: {
        id: user.id,
        email: user.email,
      },
    });
  }

  return { success: true };
};
