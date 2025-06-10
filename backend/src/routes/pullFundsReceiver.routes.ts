import { Router } from "express";
import { recibirPullFunds } from "../controller/pullFundsReceiver.controller";

const router = Router();

router.post("/pull-funds", (req, res, next) => {
  Promise.resolve(recibirPullFunds(req, res)).catch(next);
});

export default router;