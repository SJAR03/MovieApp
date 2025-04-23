import { Request, Response, NextFunction } from "express";
import { ReservationRegisterPayload } from "../utils/types/reservation";
import { registerReservationService } from "../services/reservationService";

export const registerReservation = async (
  req: Request<{}, {}, ReservationRegisterPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId; // extraído del token por el authMiddleware
    const { theaterId, reservationDate, seatsId } = req.body;

    const reservation = await registerReservationService({
      userId,
      theaterId,
      reservationDate,
      seatsId,
    });

    res
      .status(201)
      .json({ reservation, message: "Reservation created successfully" });
  } catch (error) {
    next(error);
  }
};
