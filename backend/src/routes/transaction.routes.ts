import { Router } from "express";
import {
  generateHmac,
  receiveTransaction,
} from "../controller/transaction.controller";

const router = Router();

router.post("/transactions/hmac", generateHmac);
router.post("/transactions", (req, res, next) => {
  // Ensure errors are passed to Express error handler
  Promise.resolve(receiveTransaction(req, res)).catch(next);
});

export default router;
