import { PrismaClient, Seats } from "@prisma/client";
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
    capacity: t.capacity,
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
      seats: {
        statusId: {
          not: 3, // Exclude inactive seats
        }
      }
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

export const updateCapacityService = async (theaterId: number, newCols: number, newRows: number) => {
  const theater = await prisma.theaters.findUnique({
    where: { id: theaterId },
    include: { seats: true }
  });

  if (!theater) throw new Error('Sala no encontrada');

  const existingSeats = theater.seats;
  const updatedCapacity = { cols: newCols, rows: newRows };

  // Crear mapa de asientos actuales activos (por fila/columna)
  const seatMap = new Map<string, Seats>();
  for (const seat of existingSeats) {
    const key = `${seat.row}-${seat.col}`;
    seatMap.set(key, seat);
  }

  const seatsToCreate: { row: number; col: number; theaterId: number; statusId: number }[] = [];
  const seatsToInactivate: number[] = [];

  // Paso 1: Crear asientos nuevos si no existen
  for (let row = 1; row <= newRows; row++) {
    for (let col = 1; col <= newCols; col++) {
      const key = `${row}-${col}`;
      const seat = seatMap.get(key);
      if (!seat) {
        seatsToCreate.push({
          row,
          col,
          theaterId,
          statusId: 1 // Disponible
        });
      } else if (seat.statusId === 3) {
        // Si estaba inactivo y ahora debe estar activo, lo reactivamos
        await prisma.seats.update({
          where: { id: seat.id },
          data: { statusId: 1 }
        });
      }
    }
  }

  // Paso 2: Inactivar asientos que están fuera del nuevo rango
  for (const seat of existingSeats) {
    if (seat.row > newRows || seat.col > newCols) {
      if (seat.statusId !== 3) {
        seatsToInactivate.push(seat.id);
      }
    }
  }

  // Crear nuevos asientos
  if (seatsToCreate.length > 0) {
    await prisma.seats.createMany({ data: seatsToCreate });
  }

  // Inactivar asientos fuera del rango
  if (seatsToInactivate.length > 0) {
    await prisma.seats.updateMany({
      where: { id: { in: seatsToInactivate } },
      data: { statusId: 3 }
    });
  }

  // Actualizar capacidad en JSON
  const updatedTheater = await prisma.theaters.update({
    where: { id: theaterId },
    data: {
      capacity: updatedCapacity
    },
    include: { seats: true }
  });

  return {
    message: 'Capacidad actualizada exitosamente.',
    capacity: updatedCapacity,
    seatsCreated: seatsToCreate.length,
    seatsInactivated: seatsToInactivate.length,
    theater: updatedTheater
  };
}