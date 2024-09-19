import bodyParser from "body-parser";
import express from "express";

import paymentRoutes from "./routes/paymentRoutes";

const app = express();

app.use(bodyParser.json());
app.use("/api/payment/", paymentRoutes);

const host = process.env.PAYMENT_HOST ?? "localhost";
const port = process.env.PAYMENT_PORT ? Number(process.env.PAYMENT_PORT) : 5000;

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
