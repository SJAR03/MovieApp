export interface Theater {
  theaterId: number;
  movieTitle: string;
  movieImage: string;
  theaterName: string;
  availableSeats: number;
}

export interface TheaterListResponse {
  data: Theater[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Capacity {
  cols: number;
  rows: number;
}

export interface Movie {
  id: number;
  title: string;
  posterImage: string;
  description: string;
}

export interface TheaterDetails {
  id: number;
  name: string;
  movieId: number;
  capacity: Capacity;
  movie: Movie;
}

export interface Seat {
  id: number;
  row: number;
  col: number;
  statusId: number;
}