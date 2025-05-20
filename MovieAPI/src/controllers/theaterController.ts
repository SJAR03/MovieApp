import { NextFunction, Request, Response } from "express";
import {
  registerTheaterService,
  listTheatersService,
  getTheaterDetailsService,
  getSeatsByDateService,
  updateCapacityService,
  updateTheaterService,
} from "../services/theaterService";
import { CreateTheaterPayload } from "../utils/types/theater";
import { getPaginationParams } from "../utils/helpers/paginationHelper";
import { PaginationResponse } from "../utils/types/pagination";

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

export const listTheaters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { theaters, total } = await listTheatersService(skip, limit);

    const response: PaginationResponse<typeof theaters> = {
      data: theaters,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getTheaterById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = await getTheaterDetailsService(id);
  res.json(data);
};

export const getTheaterSeatsByDate = async (req: Request, res: Response) => {
  const theaterId = parseInt(req.params.id);
  const date = new Date(req.query.date as string);
  const seats = await getSeatsByDateService(theaterId, date);
  res.json(seats);
};

export const updateTheaterCapacity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cols, rows } = req.body;

  if (!cols || !rows || cols <= 0 || rows <= 0) {
    res.status(400).json({ message: 'Los valores de cols y rows deben ser mayores que 0.' });
  }

  try {
    const result = await updateCapacityService(Number(id), cols, rows);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al actualizar la capacidad.' });
  }
}

// Service to update the theater information, just name and the movie
export const updateTheater = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, movieId } = req.body;

  if (!name || !movieId) {
    res.status(400).json({ message: 'Los valores de name y movieId son obligatorios.' });
  }

  try {
    const result = await updateTheaterService(Number(id), name, movieId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al actualizar la sala.' });
  }
}