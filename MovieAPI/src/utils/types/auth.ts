export interface RegisterUserRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginUserRequest {
  username: string;
  password: string;
}