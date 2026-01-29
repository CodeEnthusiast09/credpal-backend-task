import { Request } from "express";
import { UserPayload } from "./user.types";

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface AuthRequestWithParams extends AuthRequest {
  params: {
    id: string;
  };
}
