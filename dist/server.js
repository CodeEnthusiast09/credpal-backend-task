"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = require("./db/connection");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const loans_routes_1 = __importDefault(require("./modules/loans/loans.routes"));
const logger_1 = require("./utils/logger");
dotenv_1.default.config({ path: ".env", quiet: true });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Loan Management API is running",
        timestamp: new Date().toISOString(),
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/loans", loans_routes_1.default);
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
app.use(error_middleware_1.errorHandler);
const startServer = async () => {
    try {
        await (0, connection_1.connectDatabase)();
        app.listen(PORT, () => {
            logger_1.logger.info(`Server is running on port ${PORT}`);
            logger_1.logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
            logger_1.logger.info(`API URL: http://localhost:${PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map