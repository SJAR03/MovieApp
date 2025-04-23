import { NextFunction, Request, Response } from "express";
import { registerTheaterService, listTheatersService, getTheaterDetailsService, getSeatsByDateService } from "../services/theaterService";
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