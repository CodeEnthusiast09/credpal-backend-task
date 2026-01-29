import mongoose, { Schema } from "mongoose";
import { ILoan, LoanDocument, LoanStatus } from "@/types";

const loanSchema = new Schema<ILoan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1000,
      max: 10_000_000,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 360,
    },
    status: {
      type: String,
      enum: Object.values(LoanStatus),
      default: LoanStatus.PENDING,
    },
    interestRate: {
      type: Number,
      default: 5,
      min: 0,
    },
    monthlyPayment: {
      type: Number,
      default: 0,
    },
    totalRepayment: {
      type: Number,
      default: 0,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

loanSchema.pre("save", function () {
  if (
    this.status !== LoanStatus.APPROVED &&
    this.status !== LoanStatus.DISBURSED
  ) {
    return;
  }

  const monthlyRate = this.interestRate / 100 / 12;
  const principal = this.amount;
  const n = this.duration;

  if (monthlyRate === 0) {
    this.monthlyPayment = principal / n;
  } else {
    this.monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);
  }

  this.totalRepayment = this.monthlyPayment * n;
});

export const Loan = mongoose.model<LoanDocument>("Loan", loanSchema);
