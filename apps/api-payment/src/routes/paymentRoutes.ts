import express from "express";

import { initiatePayment } from "../controllers/paymentController";

const router = express.Router();

router.post("/create", initiatePayment);

export default router;
