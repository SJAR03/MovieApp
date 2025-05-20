import { NextFunction, Request, Response } from "express";
import {
  registerMovieService,
  getMoviesService,
  updateMovieService,
  getMovieDetailsService,
} from "../services/movieService";
import { RegisterMovieRequest, UpdateMovieRequest } from "../utils/types/movie";

export const registerMovie = async (req: Request<{}, {}, RegisterMovieRequest>, res: Response, next: NextFunction) => {
    try {
        const movie = await registerMovieService(req.body);
        res.status(201).json({ movie, message: "Movie created successfully" });
    } catch (error: any) {
        next(error); // Pass the error to the error handler middleware
    }
}

// Endpoint para obtener la lista de películas
export const getMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movies = await getMoviesService();
        res.status(200).json(movies);
    } catch (error: any) {
        next(error); // Pass the error to the error handler middleware
    }
}

export const updateMovie = async (req: Request<{}, {}, UpdateMovieRequest>, res: Response, next: NextFunction) => {
    try {
        const movie = await updateMovieService(req.body);
        res.status(201).json({ movie, message: "Movie updated successfully" });
    } catch (error: any) {
        next(error); // Pass the error to the error handler middleware
    }
}

// Get movie by id
export const getMovieById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const data = await getMovieDetailsService(id);
    res.json(data);
}