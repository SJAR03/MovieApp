import api from "../utils/api";
import { TheaterListResponse, TheaterDetails, Seat } from "../interfaces/theater";

export const fetchTheaterList = async (
  page: number
): Promise<TheaterListResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/theater/list?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Error al obtener la lista de salas";
  }
};

export const fetchTheaterDetails = async (
  theaterId: string
): Promise<TheaterDetails> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/theater/${theaterId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Error al obtener los detalles de la sala de cine"
    );
  }
};

export const fetchTheaterSeats = async (
  theaterId: string,
  date: string
): Promise<Seat[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/theater/${theaterId}/seats?date=${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Error al obtener el estado de los asientos"
    );
  }
};