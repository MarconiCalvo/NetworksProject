import { Router, Request, Response, NextFunction } from "express";
import {
  generateHmac,
  receiveTransaction,
} from "../controller/transaction.controller";

const router = Router();

router.post("/transactions/hmac", (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(generateHmac(req, res)).catch(next);
});

router.post("/transactions", (req: Request, res: Response, next: NextFunction) => {
  // Ensure errors are passed to Express error handler
  Promise.resolve(receiveTransaction(req, res)).catch(next);
});

export default router;
