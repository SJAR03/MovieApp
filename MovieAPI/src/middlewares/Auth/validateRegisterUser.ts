import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/ApiError";

export const validateRegisterUser = (req: Request, res: Response, next: NextFunction) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return next(new BadRequestError('Missing required fields: name, username, email and password'));
    }

    next();
};