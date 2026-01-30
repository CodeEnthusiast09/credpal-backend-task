"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../modules/users/user.model");
const types_1 = require("../types");
const logger_1 = require("../utils/logger");
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/loan-management";
        await mongoose_1.default.connect(mongoUri);
        logger_1.logger.info("MongoDB connected successfully");
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (adminEmail && adminPassword) {
            await seedAdmin(adminEmail, adminPassword);
        }
    }
    catch (err) {
        logger_1.logger.error("MongoDB connection error:", err);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const seedAdmin = async (email, password) => {
    try {
        const existingAdmin = await user_model_1.User.findOne({ email });
        if (existingAdmin) {
            logger_1.logger.info("Admin user already exists");
            return;
        }
        await user_model_1.User.create({
            email,
            password,
            firstName: "Admin",
            lastName: "User",
            role: types_1.UserRole.ADMIN,
        });
        logger_1.logger.info("Admin user created successfully");
    }
    catch (err) {
        logger_1.logger.error("Failed to seed admin user:", err);
    }
};
//# sourceMappingURL=connection.js.map