import { PrismaClient } from "@prisma/client";
import { BadRequestError } from '../utils/ApiError';
import { RegisterMovieRequest, UpdateMovieRequest } from '../utils/types/movie';

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

export const getMoviesService = async () => {
    const movies = await prisma.movie.findMany();
    return movies;
}

export const updateMovieService = async (movieData: UpdateMovieRequest) => {
  // Check if the movie already exists by id
    const existingMovie = await prisma.movie.findUnique({
        where: {
        id: movieData.id,
        },
    });

    if (!existingMovie) {
        throw new BadRequestError("Movie not found");
    }

  // Update the movie
    const movie = await prisma.movie.update({
        where: {
            id: movieData.id,
        },
        data: {
            title: movieData.title,
            posterImage: movieData.posterImage,
            description: movieData.description,
        },
    });

  return movie;
};

export const getMovieDetailsService = async (id: number) => {
    const movie = await prisma.movie.findUnique({
        where: {
            id: id,
        },
    });

    if (!movie) {
        throw new BadRequestError("Movie not found");
    }

    return movie;
}