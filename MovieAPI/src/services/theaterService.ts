import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../utils/ApiError";
import { CreateTheaterPayload } from "../utils/types/theater";

const prisma = new PrismaClient();

export const registerTheaterService = async (theaterData: CreateTheaterPayload) => {
    const { name, movieId, capacity } = theaterData;

    const newTheater = await prisma.theaters.create({
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

    await prisma.seats.createMany({
        data: seatsToCreate,
    });

    return newTheater;
}