import express from "express";

import { initiatePayment } from "../controllers/paymentController";
import { checkOrderStatus } from "../controllers/statusController";

const router = express.Router();

router.post("/create", initiatePayment);
router.post("/check-status-order", checkOrderStatus);

export default router;
