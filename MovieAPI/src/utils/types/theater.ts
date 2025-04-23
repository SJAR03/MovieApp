export interface CreateTheaterPayload {
  name: string;
  movieId: number;
  capacity: {
    rows: number;
    cols: number;
  };
}

export interface TheaterWithMovie {
  id: number;
  name: string;
  movieId: number;
  capacity: {
    cols: number;
    rows: number;
  };
  movie: {
    id: number;
    title: string;
    posterImage: string;
    description: string;
  };
}

export interface SeatStatusResponse {
  id: number;
  row: number;
  col: number;
  statusId: number; // 1: disponible, 2: reservado
}