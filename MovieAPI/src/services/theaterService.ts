import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../utils/ApiError";
import { CreateTheaterPayload, TheaterWithMovie, SeatStatusResponse } from "../utils/types/theater";

const prisma = new PrismaClient();

export const registerTheaterService = async (theaterData: CreateTheaterPayload) => {
    const { name, movieId, capacity } = theaterData;

    const result = await prisma.$transaction(async (tx) => {
        const newTheater = await tx.theaters.create({
            data: {
                name,
                movieId,
                capacity: {
                    rows: capacity.rows,
                    cols: capacity.cols,
                }
            },
        });

        const seatsToCreate = [];
        const availableStatusId = 1; // Assuming 1 is the ID for available status

        for (let row = 1; row <= capacity.rows; row++) {
            for (let col = 1; col <= capacity.cols; col++) {
                seatsToCreate.push({
                    row,
                    col,
                    statusId: availableStatusId,
                    theaterId: newTheater.id,
                });
            }
        }

        await tx.seats.createMany({
            data: seatsToCreate,
        });

        return newTheater;
    });

    return result;
}

export const listTheatersService = async (skip: number, limit: number) => {
  const prisma = new PrismaClient();

  const [theaters, total] = await prisma.$transaction([
    prisma.theaters.findMany({
      skip,
      take: limit,
      include: {
        movie: {
          select: {
            title: true,
            posterImage: true,
          },
        },
        seats: {
          where: { statusId: 1 }, // Asientos disponibles
          select: { id: true },
        },
      },
    }),
    prisma.theaters.count(),
  ]);

  const mapped = theaters.map((t) => ({
    theaterId: t.id,
    movieTitle: t.movie.title,
    movieImage: t.movie.posterImage,
    theaterName: t.name,
    availableSeats: t.seats.length,
  }));

  return { theaters: mapped, total };
};

export const getTheaterDetailsService = async (
  id: number
): Promise<TheaterWithMovie | null> => {
  const theater = await prisma.theaters.findUnique({
    where: { id },
    include: {
      movie: true,
    },
  });

  if (!theater) return null;

  return {
    id: theater.id,
    name: theater.name,
    movieId: theater.movieId,
    capacity: theater.capacity as { cols: number; rows: number },
    movie: {
      id: theater.movie.id,
      title: theater.movie.title,
      posterImage: theater.movie.posterImage,
      description: theater.movie.description,
    },
  };
};

export const getSeatsByDateService = async (
  theaterId: number,
  date: Date
): Promise<SeatStatusResponse[]> => {
  // Get all theater seats
  const seats = await prisma.seats.findMany({
    where: {
      theaterId: theaterId,
    },
  });

  // Get all reserved seats for the given date
  const reservationSeats = await prisma.reservation_Seats.findMany({
    where: {
      reservation: {
        theaterId,
        reservationDate: date,
      },
    },
    include: {
      seats: {
        select: {
          id: true,
          row: true,
          col: true,
        },
      },
    },
  });

  // Create a map of reserved seats to check if the seat is reserved
  const reservedSeats = new Set(
    reservationSeats.map((rs) => `${rs.seats.row}-${rs.seats.col}`)
  );

  // Assign status to each seat
  return seats.map((seat) => ({
    id: seat.id,
    row: seat.row,
    col: seat.col,
    statusId: reservedSeats.has(`${seat.row}-${seat.col}`) ? 2 : 1, // 2: reservado, 1: disponible
  }));
};