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

interface CreateMoviePayload extends Omit<Movie, "id"> {}

interface CreateMovieResponse {
  movie: Movie;
  message: string;
}

export const createNewMovie = async (
  payload: CreateMoviePayload
): Promise<CreateMovieResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post<CreateMovieResponse>(
      "/movie/register",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Error al crear la película";
  }
};

// La interfaz para el payload de actualización es exactamente Movie
interface UpdateMoviePayload extends Movie {}

interface UpdateMovieResponse {
  movie: Movie;
  message: string;
}

export const updateMovie = async (
  payload: UpdateMoviePayload
): Promise<UpdateMovieResponse> => {
  try {
    const token = localStorage.getItem("token");
    // Aseguramos que el id esté presente para la URL
    const response = await api.put<UpdateMovieResponse>(
      `/movie/${payload.id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Error al actualizar la película";
  }
};

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface UserListResponse {
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchActiveUsers = async (
  page: number = 1
): Promise<UserListResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get<UserListResponse>(
      `/user/activeUsers?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Error al obtener la lista de usuarios activos"
    );
  }
};

export const disableUser = async (userId: number): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/user/inactiveUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    });
    // El endpoint devuelve 204 No Content, por lo que no hay datos en la respuesta.
  } catch (error: any) {
    throw error.response?.data?.message || "Error al deshabilitar el usuario";
  }
};

export const fetchMovieById = async (movieId: number): Promise<Movie> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get<Movie>(`/movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      `Error al obtener la película con ID ${movieId}`
    );
  }
};

interface UpdateTheaterDetailsPayload {
  name: string;
  movieId: number;
}

interface UpdateTheaterDetailsResponse {
  id: number;
  name: string;
  movieId: number;
  capacity: {
    cols: number;
    rows: number;
  };
}

export const updateTheaterDetails = async (
  theaterId: number,
  payload: UpdateTheaterDetailsPayload
): Promise<UpdateTheaterDetailsResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put<UpdateTheaterDetailsResponse>(
      `/theater/${theaterId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Error al actualizar los detalles de la sala"
    );
  }
};