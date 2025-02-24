import { NextFunction, Request, Response } from 'express';
import { loginUserService, registerUserService } from '../services/authService';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await registerUserService(req.body);
        res.status(201).json({user, message: 'User created successfully'});
    } catch (error: any) {
        next(error); // Pass the error to the error handler middleware
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = await loginUserService(req.body);
        res.status(200).json({token, message: 'Login successful'});
    } catch (error: any) {
        next(error); // Pass the error to the error handler middleware
    }
};