import api from "../utils/api";
import { LoginCredentials, RegisterData } from "../interfaces/auth";
import { AxiosResponse } from "axios";

export const login = async (
  credentials: LoginCredentials
): Promise<AxiosResponse<{ token: string }>> => {
  try {
    const response = await api.post<{ token: string }>(
      "/auth/login",
      credentials
    );
    return response;
  } catch (error: any) {
    throw error.response?.data?.message || "Error al iniciar sesión";
  }
};

export const register = async (
  userData: RegisterData
): Promise<AxiosResponse> => {
  try {
    const response = await api.post("/auth/register", userData);
    return response;
  } catch (error: any) {
    throw error.response?.data?.message || "Error al crear la cuenta";
  }
};

export const verifyToken = async (token: string): Promise<void> => {
  try {
    await api.get("/auth/verify-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // If the request is successful (e.g., 200 OK), the token is valid.
    // No need to return anything, just resolve the promise.
  } catch (error: any) {
    // If the request fails (e.g., 401 Unauthorized), the token is invalid.
    throw error;
  }
};