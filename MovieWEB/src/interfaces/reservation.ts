export interface ReservationResponse {
  reservation: {
    id: number;
    userId: number;
    theaterId: number;
    reservationDate: string;
    reservationSeat: {
      id: number;
      reservationId: number;
      seatsId: number;
      seats: {
        id: number;
        theaterId: number;
        row: number;
        col: number;
        statusId: number;
      };
    }[];
  };
  message: string;
}

export interface CreateReservationPayload {
  theaterId: number;
  reservationDate: string;
  seatsId: number[];
}
