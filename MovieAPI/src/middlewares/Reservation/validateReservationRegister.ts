import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/ApiError";

export const validateReservationRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { theaterId, reservationDate, seatsId } = req.body;

  if (!theaterId || typeof theaterId !== "number") {
    throw new BadRequestError("theaterId is required and must be a number");
  }

  if (
    !reservationDate ||
    typeof reservationDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(reservationDate)
  ) {
    throw new BadRequestError("reservationDate must be in YYYY-MM-DD format");
  }

  if (
    !Array.isArray(seatsId) ||
    seatsId.length === 0 ||
    !seatsId.every((id) => typeof id === "number")
  ) {
    throw new BadRequestError("seatsId must be a non-empty array of numbers");
  }

  next();
};
