import { Response } from "express";
export declare class LoansController {
    private loansService;
    constructor();
    createLoan: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getUserLoans: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getLoanById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    updateLoan: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    deleteLoan: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getAllLoans: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    approveLoan: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    disburseLoan: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
