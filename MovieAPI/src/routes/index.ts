import express, { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import movieRouter from './movie';
import theaterRouter from './theater';

const router: Router = express.Router();

// Here will be the specific routes of each resource
// Example: router.use('/movies', moviesRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/movie', movieRouter);
router.use('/theater', theaterRouter);

export default router;