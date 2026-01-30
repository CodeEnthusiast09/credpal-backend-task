import { RegisterDto, LoginDto, AuthResponse, UserPayload } from "../../types";
export declare class AuthService {
    private readonly JWT_SECRET;
    private readonly JWT_EXPIRES_IN;
    constructor();
    register(data: RegisterDto): Promise<AuthResponse>;
    login(data: LoginDto): Promise<AuthResponse>;
    private generateToken;
    verifyToken(token: string): UserPayload;
}
