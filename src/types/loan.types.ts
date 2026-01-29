import { Document, Types } from "mongoose";

export enum LoanStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  DISBURSED = "disbursed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface ILoan {
  userId: Types.ObjectId;
  amount: number;
  purpose: string;
  duration: number;
  status: LoanStatus;
  interestRate: number;
  monthlyPayment: number;
  totalRepayment: number;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
}

export interface CreateLoanDto {
  amount: number;
  purpose: string;
  duration: number;
}

export interface UpdateLoanDto {
  amount?: number;
  purpose?: string;
  duration?: number;
}

export interface ApproveLoanDto {
  status: LoanStatus.APPROVED | LoanStatus.REJECTED;
  rejectionReason?: string;
  interestRate?: number;
}

export interface LoanQueryDto {
  status?: LoanStatus;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface LoanDocument extends ILoan, Document {
  createdAt: Date;
  updatedAt: Date;
}
