"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const response_helper_1 = require("../../utils/response.helper");
const error_middleware_1 = require("../../middleware/error.middleware");
class AuthController {
    authService;
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    register = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const data = req.body;
        if (!data.email || !data.password || !data.firstName || !data.lastName) {
            return response_helper_1.ResponseHelper.error(res, "All fields are required", [
                { message: "Email, password, firstName, and lastName are required" },
            ]);
        }
        if (data.password.length < 6) {
            return response_helper_1.ResponseHelper.error(res, "Validation failed", [
                {
                    field: "password",
                    message: "Password must be at least 6 characters",
                },
            ]);
        }
        const result = await this.authService.register(data);
        return response_helper_1.ResponseHelper.created(res, "User registered successfully", result);
    });
    login = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const data = req.body;
        if (!data.email || !data.password) {
            return response_helper_1.ResponseHelper.error(res, "Email and password are required", [
                { message: "Email and password are required" },
            ]);
        }
        const result = await this.authService.login(data);
        return response_helper_1.ResponseHelper.success(res, "Login successful", result);
    });
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map