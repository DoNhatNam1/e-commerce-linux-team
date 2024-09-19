"use server";

import { prisma as db } from "@e-com-linux-team/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

function extractOrderId(app_trans_id: string): { orderId: number } {
  const parts = app_trans_id.split("_");

  const orderIdPart = parts[1];

  const orderId = parseInt(orderIdPart, 10);

  return { orderId };
}

export const getPaymentStatus = async ({
  app_trans_id,
}: {
  app_trans_id: string;
}) => {
  const result = extractOrderId(app_trans_id);

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    throw new Error("Bạn cần đăng nhập để truy cập vào trang.");
  }

  const order = await db.tbOrder.findFirst({
    where: { id: result.orderId, userId: user.id },
    include: {
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  });

  console.log(order!.isPaid);

  if (!order) throw new Error("Đơn hàng không tồn tại.");

  if (order.isPaid) {
    return order;
  } else {
    return false;
  }
};
