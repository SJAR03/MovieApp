import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ApiError, BadRequestError, UnauthorizedError } from "../utils/ApiError";
import { RegisterUserRequest, LoginUserRequest } from "../utils/types/auth";

const prisma = new PrismaClient();

export const registerUserService = async (userData: RegisterUserRequest) => {
  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: userData.email
    },
  });

  if (existingUser) {
    throw new BadRequestError("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      status: true,
    },
  });

  // Assign the default role to the user
  await prisma.user_Role.create({
    data: {
      userId: user.id,
      roleId: 2,
    },
  });

  return user;
};

export const loginUserService = async (credencials: LoginUserRequest) => {
  const user = await prisma.user.findUnique({
    where: {
      email: credencials.email,
    },
  });
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const passWordMatch = await bcrypt.compare(
    credencials.password,
    user.password
  );
  if (!passWordMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // Get the user role
  const userRole = await prisma.user_Role.findMany({
    where: {
      userId: user.id,
    },
    include: { role: true },
  });

  const roles = userRole.map((userRole) => userRole.role.name);

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT secret not defined");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      roles: roles, //include the roles in the token
    },
    jwtSecret,
    {
      expiresIn: "1h",
    }
  );

  return token;
};
