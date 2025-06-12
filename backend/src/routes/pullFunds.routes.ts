import { Router } from "express";
import { pullFundsService, pullFundsReceiver } from "../controller/pullFunds.controller";

const router = Router();

// Endpoint para solicitar fondos de otro banco
router.post("/pull-funds", pullFundsService);

// Endpoint para recibir solicitud de fondos de otro banco
router.post("/enviar-pull-funds", pullFundsReceiver);

export default router;
