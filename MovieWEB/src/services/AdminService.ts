// src/services/AdminService.ts
import api from "../utils/api";
import { Movie } from "../interfaces/movie";

export const fetchMovieListAdmin = async (): Promise<Movie[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get<Movie[]>("/movie/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message || "Error al obtener la lista de películas"
    );
  }
};

interface CreateTheaterPayload {
  name: string;
  movieId: number;
  capacity: {
    rows: number;
    cols: number;
  };
}

export const createNewTheater = async (
  payload: CreateTheaterPayload
): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/theater/register", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Error al crear la sala de cine";
  }
};

export interface TheaterItem {
  theaterId: number;
  movieTitle: string;
  movieImage: string;
  theaterName: string;
  availableSeats: number;
  capacity: {
    cols: number;
    rows: number;
  };
}

export interface TheaterListResponse {
  data: TheaterItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchTheaterListAdmin = async (
  page: number = 1
): Promise<TheaterListResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get<TheaterListResponse>(
      `/theater/list?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Error al obtener la lista de salas de cine"
    );
  }
};

interface UpdateCapacityPayload {
  rows: number;
  cols: number;
}

export const updateTheaterCapacity = async (
  theaterId: number,
  payload: UpdateCapacityPayload
): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(`/theater/${theaterId}/capacity`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Error al actualizar la capacidad de la sala"
    );
  }
};