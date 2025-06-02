import { Router } from "express";
import {
  createAccount,
  getAccountOwnerName,
  getAccounts,
  getAccountTransactionDetails,
  getAllAccounts,
  getNewIban,
} from "../controller/account.controller";

const router = Router();

router.post("/accounts", (req, res, next) => {
  Promise.resolve(createAccount(req, res)).catch(next);
});
router.get("/accounts/iban", getNewIban);
router.get("/accounts", getAccounts);
router.get("/accounts/all", (req, res, next) => {
  Promise.resolve(getAllAccounts(req, res)).catch(next);
});
router.get("/accounts/owner/:number", (req, res, next) => {
  Promise.resolve(getAccountOwnerName(req, res)).catch(next);
});
router.get("/accounts/:number/details", (req, res, next) => {
  Promise.resolve(getAccountTransactionDetails(req, res)).catch(next);
});

export default router;
