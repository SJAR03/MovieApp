import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerUserService = async (userData: any) => {
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

export const loginUserService = async (credencials: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email: credencials.email,
    },
  });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passWordMatch = await bcrypt.compare(
    credencials.password,
    user.password
  );
  if (!passWordMatch) {
    throw new Error("Invalid credentials");
  }

  // Get the user role
  const userRole = await prisma.user_Role.findMany({
    where: {
      userId: user.id,
    },
    include: { role: true },
  });

  const roles = userRole.map((userRole) => userRole.role.name);

  const token = jwt.sign(
    {
      userId: user.id,
      roles: roles, //include the roles in the token
    },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "1h",
    }
  );

  return token;
};
