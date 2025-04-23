import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../utils/ApiError";
import { ReservationRegisterServicePayload } from "../utils/types/reservation";

const prisma = new PrismaClient();

export const registerReservationService = async ({
  userId,
  theaterId,
  reservationDate,
  seatsId,
}: ReservationRegisterServicePayload) => {
  if (!seatsId || seatsId.length === 0) {
    throw new BadRequestError("No seats selected");
  }

  const reservation = await prisma.reservations.create({
    data: {
      userId,
      theaterId,
      reservationDate: new Date(reservationDate),
      reservationSeat: {
        create: seatsId.map((seatId) => ({
          seats: {
            connect: { id: seatId },
          },
        })),
      },
    },
    include: {
      reservationSeat: {
        include: {
          seats: true,
        },
      },
    },
  });

  return reservation;
};
