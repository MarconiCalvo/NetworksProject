import { Router } from "express";
import { associatePhone } from "../controller/phoneLink.controller";

const router = Router();

router.post("/phone-link", (req, res, next) => {
  associatePhone(req, res).catch(next);
});

export default router;
