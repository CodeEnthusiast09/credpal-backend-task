"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoansController = void 0;
const loans_service_1 = require("./loans.service");
const types_1 = require("../../types");
const response_helper_1 = require("../../utils/response.helper");
const error_middleware_1 = require("../../middleware/error.middleware");
class LoansController {
    loansService;
    constructor() {
        this.loansService = new loans_service_1.LoansService();
    }
    createLoan = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const data = req.body;
        const userId = req.user.userId;
        if (!data.amount || !data.purpose || !data.duration) {
            return response_helper_1.ResponseHelper.error(res, "All fields are required", [
                { message: "Amount, purpose, and duration are required" },
            ]);
        }
        const loan = await this.loansService.createLoan(userId, data);
        return response_helper_1.ResponseHelper.created(res, "Loan request created successfully", loan);
    });
    getUserLoans = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        const loans = await this.loansService.getUserLoans(userId);
        return response_helper_1.ResponseHelper.success(res, "Loans retrieved successfully", loans);
    });
    getLoanById = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;
        const loan = await this.loansService.getLoanById(id, userId);
        return response_helper_1.ResponseHelper.success(res, "Loan retrieved successfully", loan);
    });
    updateLoan = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const userId = req.user.userId;
        const loan = await this.loansService.updateLoan(id, userId, data);
        return response_helper_1.ResponseHelper.success(res, "Loan updated successfully", loan);
    });
    deleteLoan = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;
        await this.loansService.deleteLoan(id, userId);
        return response_helper_1.ResponseHelper.success(res, "Loan deleted successfully");
    });
    getAllLoans = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const status = req.query.status;
        const loans = await this.loansService.getAllLoans(status);
        return response_helper_1.ResponseHelper.success(res, "All loans retrieved successfully", loans);
    });
    approveLoan = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const adminId = req.user.userId;
        if (!data.status) {
            return response_helper_1.ResponseHelper.error(res, "Status is required", [
                {
                    field: "status",
                    message: "Status must be either approved or rejected",
                },
            ]);
        }
        if (data.status === types_1.LoanStatus.REJECTED && !data.rejectionReason) {
            return response_helper_1.ResponseHelper.error(res, "Rejection reason is required", [
                {
                    field: "rejectionReason",
                    message: "Please provide a reason for rejection",
                },
            ]);
        }
        const loan = await this.loansService.approveLoan(id, adminId, data);
        return response_helper_1.ResponseHelper.success(res, "Loan status updated successfully", loan);
    });
    disburseLoan = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const loan = await this.loansService.disburseLoan(id);
        return response_helper_1.ResponseHelper.success(res, "Loan disbursed successfully", loan);
    });
}
exports.LoansController = LoansController;
//# sourceMappingURL=loans.controller.js.map