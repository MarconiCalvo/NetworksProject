// src/routes/messages.routes.ts

import { Router } from "express";
import { receiveMessage } from "../controller/messages.controller";

const router = Router();

router.post("/message", (req, res, next) => {
  Promise.resolve(receiveMessage(req, res)).catch(next);
});

export default router;
