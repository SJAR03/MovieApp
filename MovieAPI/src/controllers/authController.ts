import { NextFunction, Request, Response, RequestHandler } from 'express';
import { loginUserService, registerUserService, verifyTokenService } from '../services/authService';
import { LoginUserRequest, RegisterUserRequest } from '../utils/types/auth';

export const registerUser = async (req: Request<{}, {}, RegisterUserRequest>, res: Response, next: NextFunction) => {
    try {
        const user = await registerUserService(req.body);
        res.status(201).json({user, message: 'User created successfully'});
    } catch (error: any) {
        next(error); // Pass the error to the error handler middleware
    }
};

export const loginUser = async (req: Request<{}, {}, LoginUserRequest>, res: Response, next: NextFunction) => {
    try {
        const token = await loginUserService(req.body);
        res.status(200).json({token, message: 'Login successful'});
    } catch (error: any) {
        next(error); // Pass the error to the error handler middleware
    }
};

export const verifyToken: RequestHandler = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    await verifyTokenService(token);
    res.status(200).send();
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};