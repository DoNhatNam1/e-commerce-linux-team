import axios from "axios";
import CryptoJS from "crypto-js";
import { Request, Response } from "express";
import qs from "qs";

import { configZalo } from "@e-com-linux-team/config";

export const checkOrderStatus = async (req: Request, res: Response) => {
  const { app_trans_id } = req.body;

  const postData = {
    app_id: configZalo.app_id,
    app_trans_id: app_trans_id,
    mac: "",
  };

  const data = `${postData.app_id}|${postData.app_trans_id}|${configZalo.key1}`;
  postData.mac = CryptoJS.HmacSHA256(data, configZalo.key1).toString(
    CryptoJS.enc.Hex,
  );

  const postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    return res.status(200).json(result.data);
  } catch (error) {
    console.error("Error checking order status:", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};
