import { Router } from "express";
import { enviarPullFunds } from "../controller/pullFunds.controller";

const router = Router();

router.post("/enviar-pull-funds", (req, res, next) => {
  Promise.resolve(enviarPullFunds(req, res)).catch(next);
});

export default router;