import express, { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import movieRouter from './movie';
import theaterRouter from './theater';
import reservationRouter from './reservation';
import reportsRouter from './reports';

const router: Router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/movie', movieRouter);
router.use('/theater', theaterRouter);
router.use('/reservation', reservationRouter);
router.use('/reports', reportsRouter);

export default router;