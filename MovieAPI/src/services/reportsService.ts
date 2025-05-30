import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const FIXED_PRICE = 10;

export const getSalesReportService = async () => {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 8);

  // Get all reservations in the next 8 days
  const reservations = await prisma.reservations.findMany({
    where: {
      reservationDate: {
        gte: today,
        lt: endDate,
      },
    },
    include: {
      reservationSeat: true,
      theater: true,
    },
  });

  // Calculate reserved seats count
  const reservedSeats = reservations.reduce((total, reservation) => {
    return total + reservation.reservationSeat.length;
  }, 0);

  // Fetch all active theaters
  const theaters = await prisma.theaters.findMany();

  // Calculate potential seats (per theater * days)
  let totalSeats = 0;
  for (const theater of theaters) {
    const { rows, cols } = theater.capacity as { rows: number; cols: number };
    const seatsPerTheater = rows * cols;
    totalSeats += seatsPerTheater * 8;
  }

  const potentialLostIncome = (totalSeats - reservedSeats) * FIXED_PRICE;
  const totalIncome = reservedSeats * FIXED_PRICE;

  return {
    reservedSeats,
    totalIncome,
    potentialLostIncome,
  };
};
