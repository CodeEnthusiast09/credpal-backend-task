import mongoose from "mongoose";
import { User } from "@/modules/users/user.model";
import { UserRole } from "@/types";
import { logger } from "@/utils/logger";

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/loan-management";
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected successfully");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      await seedAdmin(adminEmail, adminPassword);
    }
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const seedAdmin = async (email: string, password: string): Promise<void> => {
  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      logger.info("Admin user already exists");
      return;
    }

    await User.create({
      email,
      password,
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
    });

    logger.info("Admin user created successfully");
  } catch (err) {
    logger.error("Failed to seed admin user:", err);
  }
};
