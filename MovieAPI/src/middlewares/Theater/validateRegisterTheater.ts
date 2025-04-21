import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/ApiError";

export const validateRegisterTheater = (req: Request, res: Response, next: NextFunction) => {
    const { name, movieId, capacity} = req.body;

    if (!name || !movieId || !capacity) {
      return next(
        new BadRequestError(
          "Missing required fields"
        )
      );
    }

    next();
};