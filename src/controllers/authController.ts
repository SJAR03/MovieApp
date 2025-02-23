import { Request, Response } from 'express';
import { loginUserService, registerUserService } from '../services/authService';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const user = await registerUserService(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const token = await loginUserService(req.body);
        res.status(200).json({token});
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};