"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoansService = void 0;
const mongoose_1 = require("mongoose");
const loan_model_1 = require("./loan.model");
const error_middleware_1 = require("../../middleware/error.middleware");
const types_1 = require("../../types");
class LoansService {
    async createLoan(userId, data) {
        const loan = await loan_model_1.Loan.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            amount: data.amount,
            purpose: data.purpose,
            duration: data.duration,
            status: types_1.LoanStatus.PENDING,
        });
        return loan;
    }
    async getUserLoans(userId) {
        const loans = await loan_model_1.Loan.find({ userId: new mongoose_1.Types.ObjectId(userId) }).sort({
            createdAt: -1,
        });
        return loans;
    }
    async getLoanById(loanId, userId) {
        const loan = await loan_model_1.Loan.findById(loanId);
        if (!loan) {
            throw new error_middleware_1.AppError("Loan not found", 404);
        }
        if (userId && loan.userId.toString() !== userId) {
            throw new error_middleware_1.AppError("You do not have permission to view this loan", 403);
        }
        await loan.populate("userId", "firstName lastName email");
        await loan.populate("approvedBy", "firstName lastName email");
        return loan;
    }
    async getAllLoans(status) {
        const query = status ? { status } : {};
        const loans = await loan_model_1.Loan.find(query)
            .populate("userId", "firstName lastName email")
            .populate("approvedBy", "firstName lastName email")
            .sort({ createdAt: -1 });
        return loans;
    }
    async updateLoan(loanId, userId, data) {
        const loan = await loan_model_1.Loan.findById(loanId);
        if (!loan) {
            throw new error_middleware_1.AppError("Loan not found", 404);
        }
        if (loan.userId.toString() !== userId) {
            throw new error_middleware_1.AppError("You do not have permission to update this loan", 403);
        }
        if (loan.status !== types_1.LoanStatus.PENDING) {
            throw new error_middleware_1.AppError("Only pending loans can be updated", 400);
        }
        if (data.amount !== undefined)
            loan.amount = data.amount;
        if (data.purpose !== undefined)
            loan.purpose = data.purpose;
        if (data.duration !== undefined)
            loan.duration = data.duration;
        await loan.save();
        return loan;
    }
    async deleteLoan(loanId, userId) {
        const loan = await loan_model_1.Loan.findById(loanId);
        if (!loan) {
            throw new error_middleware_1.AppError("Loan not found", 404);
        }
        if (loan.userId.toString() !== userId) {
            throw new error_middleware_1.AppError("You do not have permission to delete this loan", 403);
        }
        if (loan.status !== types_1.LoanStatus.PENDING) {
            throw new error_middleware_1.AppError("Only pending loans can be deleted", 400);
        }
        await loan_model_1.Loan.findByIdAndDelete(loanId);
    }
    async approveLoan(loanId, adminId, data) {
        const loan = await loan_model_1.Loan.findById(loanId);
        if (!loan) {
            throw new error_middleware_1.AppError("Loan not found", 404);
        }
        if (loan.status !== types_1.LoanStatus.PENDING) {
            throw new error_middleware_1.AppError("Only pending loans can be approved or rejected", 400);
        }
        loan.status = data.status;
        loan.approvedBy = new mongoose_1.Types.ObjectId(adminId);
        loan.approvedAt = new Date();
        if (data.status === types_1.LoanStatus.REJECTED && data.rejectionReason) {
            loan.rejectionReason = data.rejectionReason;
        }
        if (data.status === types_1.LoanStatus.APPROVED) {
            if (data.interestRate !== undefined) {
                loan.interestRate = data.interestRate;
            }
        }
        await loan.save();
        return loan;
    }
    async disburseLoan(loanId) {
        const loan = await loan_model_1.Loan.findById(loanId);
        if (!loan) {
            throw new error_middleware_1.AppError("Loan not found", 404);
        }
        if (loan.status !== types_1.LoanStatus.APPROVED) {
            throw new error_middleware_1.AppError("Only approved loans can be disbursed", 400);
        }
        loan.status = types_1.LoanStatus.DISBURSED;
        await loan.save();
        return loan;
    }
}
exports.LoansService = LoansService;
//# sourceMappingURL=loans.service.js.map