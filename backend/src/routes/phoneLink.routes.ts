import { Router } from "express";
import { associatePhone } from "../controller/phoneLink.controller";

const router = Router();

// Ensure associatePhone is a valid request handler
router.post("/phone-link", (req, res, next) => {
  associatePhone(req, res).catch(next);
});

export default router;
