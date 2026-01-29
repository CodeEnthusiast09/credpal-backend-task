import { Response, NextFunction } from "express";
import { ResponseHelper } from "@/utils/response.helper";
import { AuthRequest, UserRole } from "@/types";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ResponseHelper.unauthorized(res, "No token provided");
      return;
    }

    const token = authHeader.substring(7);

    const payload = authService.verifyToken(token);

    req.user = payload;

    next();
  } catch (error) {
    ResponseHelper.unauthorized(res, "Invalid or expired token");
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    ResponseHelper.unauthorized(res, "Authentication required");
    return;
  }

  if (req.user.role !== UserRole.ADMIN) {
    ResponseHelper.forbidden(res, "Admin access required");
    return;
  }

  next();
};
