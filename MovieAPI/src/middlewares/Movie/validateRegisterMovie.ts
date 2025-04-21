import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/ApiError";

export const validateRegisterMovie = (req: Request, res: Response, next: NextFunction) => {
    const { title, posterImage, description} = req.body;

    if (!title || !posterImage || !description) {
      return next(
        new BadRequestError(
          "Missing required fields"
        )
      );
    }

    next();
};