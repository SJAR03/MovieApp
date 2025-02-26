import { NextFunction, Request, Response } from "express";
import { listActiveUsersService, disableUserService } from "../services/userService";


export const listActiveUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await listActiveUsersService();
        res.status(200).json(users);
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
}

export const disableUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        await disableUserService(userId);
        res.status(204).send();
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
}