import { Router } from "express";
import { receiveTransfer } from "../controller/external.controller";
import { handleSinpeTransfer } from "../controller/sinpe.controller";

const router = Router();

// Ruta para recibir transferencias desde otros bancos
router.post("/sinpe-transfer", (req, res, next) => {
  Promise.resolve(receiveTransfer(req, res)).catch(next);
});

router.post("/sinpe-movil-transfer", (req, res, next) => {
  Promise.resolve(handleSinpeTransfer(req, res)).catch(next);
});

export default router;
