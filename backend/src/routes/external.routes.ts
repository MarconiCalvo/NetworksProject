import { Router } from "express";
import { receiveTransfer } from "../controller/external.controller";

const router = Router();

// Ruta para recibir transferencias desde otros bancos
router.post("/receive-transfer", (req, res, next) => {
  Promise.resolve(receiveTransfer(req, res)).catch(next);
});

export default router;
