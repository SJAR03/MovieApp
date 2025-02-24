import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }

    // Not controlled error
    res.status(500).json({ message: 'Something went wrong' });
}

export default errorHandler;