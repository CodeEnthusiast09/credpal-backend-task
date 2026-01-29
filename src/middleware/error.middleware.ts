import { logger } from "@/utils/logger";
import { ResponseHelper } from "../utils/response.helper";
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public errors?: Array<{ field?: string; message: string }>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  logger.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    return ResponseHelper.error(res, err.message, err.errors, err.statusCode);
  }

  if (err.name === "ValidationError") {
    return ResponseHelper.error(res, "Validation failed", undefined, 400);
  }

  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    return ResponseHelper.error(res, "Resource already exists", undefined, 409);
  }

  if (err.name === "JsonWebTokenError") {
    return ResponseHelper.unauthorized(res, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return ResponseHelper.unauthorized(res, "Token expired");
  }

  return ResponseHelper.serverError(res, "Something went wrong");
};

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export const asyncHandler =
  (fn: AsyncHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
