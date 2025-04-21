import { NextFunction, Request, Response } from "express";
import { registerMovieService } from "../services/movieService";
import { RegisterMovieRequest } from "../utils/types/movie";

export const registerMovie = async (req: Request<{}, {}, RegisterMovieRequest>, res: Response, next: NextFunction) => {
    try {
        const movie = await registerMovieService(req.body);
        res.status(201).json({ movie, message: "Movie created successfully" });
    } catch (error: any) {
        next(error); // Pass the error to the error handler middleware
    }
}