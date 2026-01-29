import { Types } from "mongoose";
import { Loan } from "./loan.model";
import { AppError } from "@/middleware/error.middleware";
import {
  LoanDocument,
  CreateLoanDto,
  UpdateLoanDto,
  ApproveLoanDto,
  LoanStatus,
} from "@/types";

export class LoansService {
  async createLoan(userId: string, data: CreateLoanDto): Promise<LoanDocument> {
    const loan = await Loan.create({
      userId: new Types.ObjectId(userId),
      amount: data.amount,
      purpose: data.purpose,
      duration: data.duration,
      status: LoanStatus.PENDING,
    });

    return loan;
  }

  async getUserLoans(userId: string): Promise<LoanDocument[]> {
    const loans = await Loan.find({ userId: new Types.ObjectId(userId) }).sort({
      createdAt: -1,
    });

    return loans;
  }

  async getLoanById(loanId: string, userId?: string): Promise<LoanDocument> {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    if (userId && loan.userId.toString() !== userId) {
      throw new AppError("You do not have permission to view this loan", 403);
    }

    await loan.populate("userId", "firstName lastName email");
    await loan.populate("approvedBy", "firstName lastName email");

    return loan;
  }

  async getAllLoans(status?: LoanStatus): Promise<LoanDocument[]> {
    const query = status ? { status } : {};

    const loans = await Loan.find(query)
      .populate("userId", "firstName lastName email")
      .populate("approvedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    return loans;
  }

  async updateLoan(
    loanId: string,
    userId: string,
    data: UpdateLoanDto,
  ): Promise<LoanDocument> {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    if (loan.userId.toString() !== userId) {
      throw new AppError("You do not have permission to update this loan", 403);
    }

    if (loan.status !== LoanStatus.PENDING) {
      throw new AppError("Only pending loans can be updated", 400);
    }

    if (data.amount !== undefined) loan.amount = data.amount;
    if (data.purpose !== undefined) loan.purpose = data.purpose;
    if (data.duration !== undefined) loan.duration = data.duration;

    await loan.save();

    return loan;
  }

  async deleteLoan(loanId: string, userId: string): Promise<void> {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    if (loan.userId.toString() !== userId) {
      throw new AppError("You do not have permission to delete this loan", 403);
    }

    if (loan.status !== LoanStatus.PENDING) {
      throw new AppError("Only pending loans can be deleted", 400);
    }

    await Loan.findByIdAndDelete(loanId);
  }

  async approveLoan(
    loanId: string,
    adminId: string,
    data: ApproveLoanDto,
  ): Promise<LoanDocument> {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    if (loan.status !== LoanStatus.PENDING) {
      throw new AppError("Only pending loans can be approved or rejected", 400);
    }

    loan.status = data.status;
    loan.approvedBy = new Types.ObjectId(adminId);
    loan.approvedAt = new Date();

    if (data.status === LoanStatus.REJECTED && data.rejectionReason) {
      loan.rejectionReason = data.rejectionReason;
    }

    if (data.status === LoanStatus.APPROVED) {
      if (data.interestRate !== undefined) {
        loan.interestRate = data.interestRate;
      }
    }

    await loan.save();

    return loan;
  }

  async disburseLoan(loanId: string): Promise<LoanDocument> {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    if (loan.status !== LoanStatus.APPROVED) {
      throw new AppError("Only approved loans can be disbursed", 400);
    }

    loan.status = LoanStatus.DISBURSED;
    await loan.save();

    return loan;
  }
}
