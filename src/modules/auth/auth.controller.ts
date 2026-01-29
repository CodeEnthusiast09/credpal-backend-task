import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "@/types";
import { ResponseHelper } from "@/utils/response.helper";
import { asyncHandler } from "@/middleware/error.middleware";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const data: RegisterDto = req.body;

    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return ResponseHelper.error(res, "All fields are required", [
        { message: "Email, password, firstName, and lastName are required" },
      ]);
    }

    if (data.password.length < 6) {
      return ResponseHelper.error(res, "Validation failed", [
        {
          field: "password",
          message: "Password must be at least 6 characters",
        },
      ]);
    }

    const result = await this.authService.register(data);
    return ResponseHelper.created(res, "User registered successfully", result);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const data: LoginDto = req.body;

    if (!data.email || !data.password) {
      return ResponseHelper.error(res, "Email and password are required", [
        { message: "Email and password are required" },
      ]);
    }

    const result = await this.authService.login(data);
    return ResponseHelper.success(res, "Login successful", result);
  });
}
