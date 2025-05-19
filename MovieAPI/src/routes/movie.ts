import express, { Router } from 'express';
import { authMiddleware } from "../middlewares/Auth/authMiddleware";
import { roleMiddleware } from "../middlewares/Auth/roleMiddleware";
import { registerMovie, getMovies } from "../controllers/movieController";
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

/**
 * @swagger
 * /movie/list:
 *   get:
 *     tags:
 *       - Movie
 *     summary: Get a list of all movies
 *     description: Returns a list of all movies. Only accessible by Admin users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Inception
 *                   posterImage:
 *                     type: string
 *                     example: https://image-url.com/poster.jpg
 *                   description:
 *                     type: string
 *                     example: A mind-bending thriller by Christopher Nolan.
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       403:
 *         description: Forbidden – user does not have the required role
 *       500:
 *         description: Internal server error
 */
router.get("/list", authMiddleware, roleMiddleware(['Admin']), getMovies);

export default router;