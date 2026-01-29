import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../modules/users/user.model";
import { UserRole } from "@/types";
import { logger } from "../utils/logger";

dotenv.config();

export const seedAdmin = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/loan-management";
    await mongoose.connect(mongoUri);

    logger.info("Connected to MongoDB for seeding");

    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      logger.info("Admin user already exists");
      process.exit(0);
    }

    await User.create({
      email: "admin@example.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
    });

    logger.info("Admin user created successfully");

    process.exit(0);
  } catch (error) {
    logger.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
