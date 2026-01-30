import { Request, Response, NextFunction } from "express";
export declare class AppError extends Error {
    statusCode: number;
    errors?: Array<{
        field?: string;
        message: string;
    }> | undefined;
    constructor(message: string, statusCode?: number, errors?: Array<{
        field?: string;
        message: string;
    }> | undefined);
}
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, _next: NextFunction) => Response;
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
export declare const asyncHandler: (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => void;
export {};
