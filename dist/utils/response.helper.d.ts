import { Response } from "express";
import { ErrorDetail } from "../types/response.types";
export declare class ResponseHelper {
    static success<T>(res: Response, message: string, data?: T, statusCode?: number): Response;
    static error(res: Response, message: string, errors?: ErrorDetail[], statusCode?: number): Response;
    static created<T>(res: Response, message: string, data?: T): Response;
    static unauthorized(res: Response, message?: string): Response;
    static forbidden(res: Response, message?: string): Response;
    static notFound(res: Response, message?: string): Response;
    static serverError(res: Response, message?: string): Response;
}
