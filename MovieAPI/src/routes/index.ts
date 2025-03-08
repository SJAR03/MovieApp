import express, { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';

const router: Router = express.Router();

// Here will be the specific routes of each resource
// Example: router.use('/movies', moviesRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;