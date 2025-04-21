import { PrismaClient } from "@prisma/client";
import { BadRequestError } from '../utils/ApiError';
import { RegisterMovieRequest } from '../utils/types/movie';

const prisma = new PrismaClient();

export const registerMovieService = async (movieData: RegisterMovieRequest) => {
    // Check if the movie already exists by title
    const existingMovie = await prisma.movie.findFirst({
        where: {
            title: movieData.title,
        },
    });

    if (existingMovie) {
        throw new BadRequestError("Movie already exists");
    }

    const movie = await prisma.movie.create({
        data: {
            title: movieData.title,
            posterImage: movieData.posterImage,
            description: movieData.description,
        },
    });

    return movie;
}