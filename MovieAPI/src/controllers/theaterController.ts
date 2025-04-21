import { NextFunction, Request, Response } from "express";
import { registerTheaterService } from "../services/theaterService";
import { CreateTheaterPayload } from "../utils/types/theater";

export const registerTheater = async (
  req: Request<{}, {}, CreateTheaterPayload>,
  res: Response,
  next: NextFunction
) => {
    try {
        const theater = await registerTheaterService(req.body);
        res.status(201).json({ theater, message: "Theater created successfully" });
    } catch (error: any) {
        next(error); // Pass the error to the error handler middleware

    }
};