export interface RegisterMovieRequest {
    title: string;
    posterImage: string;
    description: string;
}

export interface UpdateMovieRequest {
    id: number;
    title: string;
    posterImage: string;
    description: string;
}