import express, { Router } from 'express';
import authRouter from './auth';

const router: Router = express.Router();

// Here will be the specific routes of each resource
// Example: router.use('/movies', moviesRouter);
router.use('/auth', authRouter);

export default router;