"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const response_helper_1 = require("../../utils/response.helper");
const types_1 = require("../../types");
const auth_service_1 = require("./auth.service");
const authService = new auth_service_1.AuthService();
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            response_helper_1.ResponseHelper.unauthorized(res, "No token provided");
            return;
        }
        const token = authHeader.substring(7);
        const payload = authService.verifyToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        response_helper_1.ResponseHelper.unauthorized(res, "Invalid or expired token");
    }
};
exports.authenticate = authenticate;
const isAdmin = (req, res, next) => {
    if (!req.user) {
        response_helper_1.ResponseHelper.unauthorized(res, "Authentication required");
        return;
    }
    if (req.user.role !== types_1.UserRole.ADMIN) {
        response_helper_1.ResponseHelper.forbidden(res, "Admin access required");
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=auth.middleware.js.map