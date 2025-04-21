export interface CreateTheaterPayload {
  name: string;
  movieId: number;
  capacity: {
    rows: number;
    cols: number;
  };
}