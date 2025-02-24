import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/ApiError";

export const validateRegisterUser = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new BadRequestError('Missing required fields: name, email and password'));
    }

    next();
};