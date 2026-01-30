import { Response, NextFunction } from "express";
import { AuthRequest } from "../../types";
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
