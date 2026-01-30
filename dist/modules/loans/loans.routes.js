"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loans_controller_1 = require("./loans.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
const loansController = new loans_controller_1.LoansController();
router.post("/", auth_middleware_1.authenticate, loansController.createLoan);
router.get("/my-loans", auth_middleware_1.authenticate, loansController.getUserLoans);
router.get("/:id", auth_middleware_1.authenticate, loansController.getLoanById);
router.put("/:id", auth_middleware_1.authenticate, loansController.updateLoan);
router.delete("/:id", auth_middleware_1.authenticate, loansController.deleteLoan);
router.get("/", auth_middleware_1.authenticate, auth_middleware_1.isAdmin, loansController.getAllLoans);
router.patch("/:id/approve", auth_middleware_1.authenticate, auth_middleware_1.isAdmin, loansController.approveLoan);
router.patch("/:id/disburse", auth_middleware_1.authenticate, auth_middleware_1.isAdmin, loansController.disburseLoan);
exports.default = router;
//# sourceMappingURL=loans.routes.js.map