"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../../types");
const error_middleware_1 = require("../../middleware/error.middleware");
const user_model_1 = require("../users/user.model");
class AuthService {
    JWT_SECRET;
    JWT_EXPIRES_IN;
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
        this.JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d");
    }
    async register(data) {
        const existingUser = await user_model_1.User.findOne({ email: data.email });
        if (existingUser) {
            throw new error_middleware_1.AppError("User with this email already exists", 409);
        }
        const user = await user_model_1.User.create({
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            role: types_1.UserRole.USER,
        });
        const token = this.generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        return {
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    async login(data) {
        const user = await user_model_1.User.findOne({ email: data.email });
        if (!user) {
            throw new error_middleware_1.AppError("Invalid email or password", 401);
        }
        const isPasswordValid = await user.comparePassword(data.password);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError("Invalid email or password", 401);
        }
        const token = this.generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        return {
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    generateToken(payload) {
        const secret = this.JWT_SECRET;
        const options = {
            expiresIn: this.JWT_EXPIRES_IN,
        };
        return jsonwebtoken_1.default.sign(payload, secret, options);
    }
    verifyToken(token) {
        const secret = this.JWT_SECRET;
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            throw new error_middleware_1.AppError("Invalid or expired token", 401);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map