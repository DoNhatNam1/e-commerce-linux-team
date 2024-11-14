import axios from "axios";
import CryptoJS from "crypto-js";
import { Request, Response } from "express";

import { formatDateTimeAndOrderId } from "../models/paymentModel";


export const initiatePayment = async (req: Request, res: Response) => {
  const reqData = req.body;

  console.log(reqData)

  const dateObject = new Date(reqData.metadata.createAt);

  const formattedString = formatDateTimeAndOrderId(
    dateObject,
    reqData.metadata.orderId,
  );

  const embed_data = {
    redirecturl: reqData.success_url,
  };


  const items: any[] = [];
  
  const order = {
    app_id: reqData.app_id,
    app_trans_id: formattedString,
    app_user: reqData.metadata.userId,
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: reqData.product.default_price_data.unit_amount,
    callback_url: reqData.callback_url,
    description: reqData.product.name,
    bank_code: "",
  };

  console.log('order= ', order)

  const data = `${reqData.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
  //@ts-ignore
  order.mac = CryptoJS.HmacSHA256(data, reqData.key1).toString();

  try {
    const result = await axios.post(reqData.endpoint, null, {
      params: order,
    });
    return res.status(200).json({url: result.data.order_url});
  } catch (error) {
    console.error("Error initiating payment:", error);
    return res.status(500).json({ message: "Failed to initiate payment" });
  }
};
