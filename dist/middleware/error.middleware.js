"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
const response_helper_1 = require("../utils/response.helper");
class AppError extends Error {
    statusCode;
    errors;
    constructor(message, statusCode = 400, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, _next) => {
    logger_1.logger.error("Error occurred:", {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    if (err instanceof AppError) {
        return response_helper_1.ResponseHelper.error(res, err.message, err.errors, err.statusCode);
    }
    if (err.name === "ValidationError") {
        return response_helper_1.ResponseHelper.error(res, "Validation failed", undefined, 400);
    }
    if (err.name === "MongoServerError" && err.code === 11000) {
        return response_helper_1.ResponseHelper.error(res, "Resource already exists", undefined, 409);
    }
    if (err.name === "JsonWebTokenError") {
        return response_helper_1.ResponseHelper.unauthorized(res, "Invalid token");
    }
    if (err.name === "TokenExpiredError") {
        return response_helper_1.ResponseHelper.unauthorized(res, "Token expired");
    }
    return response_helper_1.ResponseHelper.serverError(res, "Something went wrong");
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=error.middleware.js.map