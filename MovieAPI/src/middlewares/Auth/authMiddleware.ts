import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../utils/ApiError";
import jwt, {JwtPayload} from "jsonwebtoken";

interface UserPayload extends JwtPayload {
        userId: number;
        roles: string[];
    }

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new UnauthorizedError('No token provided'));
    }

    const parts = authHeader.split(' ');
    if (parts.length !==2 || parts[0] !== 'Bearer') {
        return next(new UnauthorizedError('Invalid token format'))
    }

    const token = parts[1];
    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return next(new UnauthorizedError('JWT secret not defined'));
        }

        const decoded = jwt.verify(token, secret) as UserPayload;
        req.user = {
            userId: decoded.userId,
            roles: decoded.roles,
        }
        next();
    } catch (error) {
        return next(new UnauthorizedError('Invalid token'));
    }
}