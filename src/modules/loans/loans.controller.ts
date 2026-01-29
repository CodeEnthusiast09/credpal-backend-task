import { Response } from "express";
import { LoansService } from "./loans.service";
import {
  CreateLoanDto,
  UpdateLoanDto,
  ApproveLoanDto,
  LoanStatus,
  AuthRequest,
  AuthRequestWithParams,
} from "@/types";
import { ResponseHelper } from "@/utils/response.helper";
import { asyncHandler } from "@/middleware/error.middleware";

export class LoansController {
  private loansService: LoansService;

  constructor() {
    this.loansService = new LoansService();
  }

  createLoan = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: CreateLoanDto = req.body;
    const userId = req.user!.userId;

    if (!data.amount || !data.purpose || !data.duration) {
      return ResponseHelper.error(res, "All fields are required", [
        { message: "Amount, purpose, and duration are required" },
      ]);
    }

    const loan = await this.loansService.createLoan(userId, data);
    return ResponseHelper.created(
      res,
      "Loan request created successfully",
      loan,
    );
  });

  getUserLoans = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const loans = await this.loansService.getUserLoans(userId);
    return ResponseHelper.success(res, "Loans retrieved successfully", loans);
  });

  getLoanById = asyncHandler(
    async (req: AuthRequestWithParams, res: Response) => {
      const { id } = req.params;
      const userId = req.user!.userId;
      const loan = await this.loansService.getLoanById(id, userId);
      return ResponseHelper.success(res, "Loan retrieved successfully", loan);
    },
  );

  updateLoan = asyncHandler(
    async (req: AuthRequestWithParams, res: Response) => {
      const { id } = req.params;
      const data: UpdateLoanDto = req.body;
      const userId = req.user!.userId;

      const loan = await this.loansService.updateLoan(id, userId, data);
      return ResponseHelper.success(res, "Loan updated successfully", loan);
    },
  );

  deleteLoan = asyncHandler(
    async (req: AuthRequestWithParams, res: Response) => {
      const { id } = req.params;
      const userId = req.user!.userId;

      await this.loansService.deleteLoan(id, userId);
      return ResponseHelper.success(res, "Loan deleted successfully");
    },
  );

  getAllLoans = asyncHandler(async (req: AuthRequest, res: Response) => {
    const status = req.query.status as LoanStatus | undefined;
    const loans = await this.loansService.getAllLoans(status);
    return ResponseHelper.success(
      res,
      "All loans retrieved successfully",
      loans,
    );
  });

  approveLoan = asyncHandler(
    async (req: AuthRequestWithParams, res: Response) => {
      const { id } = req.params;
      const data: ApproveLoanDto = req.body;
      const adminId = req.user!.userId;

      if (!data.status) {
        return ResponseHelper.error(res, "Status is required", [
          {
            field: "status",
            message: "Status must be either approved or rejected",
          },
        ]);
      }

      if (data.status === LoanStatus.REJECTED && !data.rejectionReason) {
        return ResponseHelper.error(res, "Rejection reason is required", [
          {
            field: "rejectionReason",
            message: "Please provide a reason for rejection",
          },
        ]);
      }

      const loan = await this.loansService.approveLoan(id, adminId, data);
      return ResponseHelper.success(
        res,
        "Loan status updated successfully",
        loan,
      );
    },
  );

  disburseLoan = asyncHandler(
    async (req: AuthRequestWithParams, res: Response) => {
      const { id } = req.params;
      const loan = await this.loansService.disburseLoan(id);
      return ResponseHelper.success(res, "Loan disbursed successfully", loan);
    },
  );
}
