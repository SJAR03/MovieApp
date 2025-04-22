export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string; // Optional to validate in the frontend
}