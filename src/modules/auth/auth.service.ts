import jwt, { Secret, SignOptions } from "jsonwebtoken";
import {
  RegisterDto,
  LoginDto,
  AuthResponse,
  UserRole,
  UserPayload,
} from "@/types";
import { AppError } from "@/middleware/error.middleware";
import type { StringValue } from "ms";
import { User } from "../users/user.model";

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: StringValue;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    this.JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as StringValue;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const user = await User.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.USER,
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

  async login(data: LoginDto): Promise<AuthResponse> {
    const user = await User.findOne({ email: data.email });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
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

  private generateToken(payload: UserPayload): string {
    const secret: Secret = this.JWT_SECRET;

    const options: SignOptions = {
      expiresIn: this.JWT_EXPIRES_IN as unknown as StringValue,
    };

    return jwt.sign(payload, secret, options);
  }

  verifyToken(token: string): UserPayload {
    const secret: Secret = this.JWT_SECRET;
    try {
      return jwt.verify(token, secret) as UserPayload;
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  }
}
