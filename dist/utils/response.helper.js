"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
class ResponseHelper {
    static success(res, message, data, statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }
    static error(res, message, errors, statusCode = 400) {
        const response = {
            success: false,
            message,
            errors,
        };
        return res.status(statusCode).json(response);
    }
    static created(res, message, data) {
        return this.success(res, message, data, 201);
    }
    static unauthorized(res, message = "Unauthorized") {
        return this.error(res, message, undefined, 401);
    }
    static forbidden(res, message = "Forbidden") {
        return this.error(res, message, undefined, 403);
    }
    static notFound(res, message = "Resource not found") {
        return this.error(res, message, undefined, 404);
    }
    static serverError(res, message = "Internal server error") {
        return this.error(res, message, undefined, 500);
    }
}
exports.ResponseHelper = ResponseHelper;
//# sourceMappingURL=response.helper.js.map