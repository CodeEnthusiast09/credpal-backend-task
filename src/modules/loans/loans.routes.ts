import { Router } from "express";
import { LoansController } from "./loans.controller";
import { authenticate, isAdmin } from "../auth/auth.middleware";

const router = Router();
const loansController = new LoansController();

router.post("/", authenticate, loansController.createLoan);
router.get("/my-loans", authenticate, loansController.getUserLoans);
router.get("/:id", authenticate, loansController.getLoanById);
router.put("/:id", authenticate, loansController.updateLoan);
router.delete("/:id", authenticate, loansController.deleteLoan);

router.get("/", authenticate, isAdmin, loansController.getAllLoans);
router.patch(
  "/:id/approve",
  authenticate,
  isAdmin,
  loansController.approveLoan,
);
router.patch(
  "/:id/disburse",
  authenticate,
  isAdmin,
  loansController.disburseLoan,
);

export default router;
