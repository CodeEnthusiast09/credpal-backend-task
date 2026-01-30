import { LoanDocument, CreateLoanDto, UpdateLoanDto, ApproveLoanDto, LoanStatus } from "../../types";
export declare class LoansService {
    createLoan(userId: string, data: CreateLoanDto): Promise<LoanDocument>;
    getUserLoans(userId: string): Promise<LoanDocument[]>;
    getLoanById(loanId: string, userId?: string): Promise<LoanDocument>;
    getAllLoans(status?: LoanStatus): Promise<LoanDocument[]>;
    updateLoan(loanId: string, userId: string, data: UpdateLoanDto): Promise<LoanDocument>;
    deleteLoan(loanId: string, userId: string): Promise<void>;
    approveLoan(loanId: string, adminId: string, data: ApproveLoanDto): Promise<LoanDocument>;
    disburseLoan(loanId: string): Promise<LoanDocument>;
}
