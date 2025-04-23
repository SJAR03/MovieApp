import api from "../utils/api";
import { ReservationResponse, CreateReservationPayload } from "../interfaces/reservation";

export const createReservation = async (
  payload: CreateReservationPayload
): Promise<ReservationResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/reservation/register", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Error al realizar la reserva";
  }
};
