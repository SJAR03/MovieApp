import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, UnauthorizedError } from '../utils/ApiError';
import { RegisterUserRequest, LoginUserRequest } from "../utils/types/auth";

const prisma = new PrismaClient();

export const registerUserService = async (userData: RegisterUserRequest) => {
  // Check if the user already exists by username and email
  
  const existingUsername = await prisma.user.findUnique({
    where: {
      username: userData.username
    },
  })

  if (existingUsername) {
    throw new BadRequestError("Username already in use");
  }
  
  const existingEmailUser = await prisma.user.findUnique({
    where: {
      email: userData.email
    },
  });

  if (existingEmailUser) {
    throw new BadRequestError("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      username: userData.username,
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
      username: credencials.username,
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

export const verifyTokenService = async (token: string): Promise<void> => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT secret not defined");
  }
  try {
    jwt.verify(token, jwtSecret);
    return; // If valid, no need to return anything
  } catch (error) {
    throw new Error("Token inválido");
  }
};