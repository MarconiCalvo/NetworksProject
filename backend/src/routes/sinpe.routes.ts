import { Router, Request, Response, NextFunction } from "express";
import {
  checkUserSinpeLink,
  handleSinpeTransfer,
  validatePhone,
} from "../controller/sinpe.controller";

const router = Router();

router.post(
  "/sinpe-movil",
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handleSinpeTransfer(req, res)).catch(next);
  }
);

router.get(
  "/validate/:phone",
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(validatePhone(req, res)).catch(next);
  }
);

router.get(
  "/sinpe/user-link/:username",
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(checkUserSinpeLink(req, res)).catch(next);
  }
);

export default router;
