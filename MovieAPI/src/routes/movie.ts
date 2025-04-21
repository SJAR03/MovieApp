import express, { Router } from 'express';
import { authMiddleware } from "../middlewares/Auth/authMiddleware";
import { roleMiddleware } from "../middlewares/Auth/roleMiddleware";
import { registerMovie } from "../controllers/movieController";
import {validateRegisterMovie} from "../middlewares/Movie/validateRegisterMovie";

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movie
 *   description: Endpoints for managing movies
 */

/**
 * @swagger
 * /movie/register:
 *   post:
 *     tags: 
 *       - Movie
 *     summary: Register a new movie
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               posterImage:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post("/register", authMiddleware, roleMiddleware(['Admin']), validateRegisterMovie, registerMovie);

export default router;