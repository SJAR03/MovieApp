export interface ReservationRegisterPayload {
  theaterId: number;
  reservationDate: string; // YYYY-MM-DD
  seatsId: number[];
}

export interface ReservationRegisterServicePayload
  extends ReservationRegisterPayload {
  userId: number;
}
