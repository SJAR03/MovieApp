import { NextFunction, Request, response, Response } from "express";
import { listActiveUsersService, disableUserService } from "../services/userService";
import { getPaginationParams } from "../utils/helpers/paginationHelper";
import { PaginationResponse } from "../utils/types/pagination";


export const listActiveUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, skip } = getPaginationParams(req);
        const { users, total } = await listActiveUsersService(skip, limit);

        if (!users || !Array.isArray(users) || users.length === 0) {
            res.status(404).json({ message: "No users found" });
            return;
            
        }

        let response: PaginationResponse<typeof users> = { data: users };

        if (limit > 0) {
            response.pagination = {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }

        res.status(200).json(response);
    } catch (error) {
        next(error);
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