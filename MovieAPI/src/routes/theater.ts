import express, { Router } from "express";
import { authMiddleware } from "../middlewares/Auth/authMiddleware";
import { roleMiddleware } from "../middlewares/Auth/roleMiddleware";
import {
  registerTheater,
  listTheaters,
  getTheaterById,
  getTheaterSeatsByDate,
  updateTheaterCapacity,
  updateTheater,
} from "../controllers/theaterController";
import { validateRegisterTheater } from "../middlewares/Theater/validateRegisterTheater";

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Theater
 *   description: Endpoints for managing theaters and their details
 */

/**
 * @swagger
 * /theater/register:
 *   post:
 *     summary: Create a new theater with its initial seats
 *     tags:
 *       - Theater
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the theater
 *               movieId:
 *                 type: integer
 *                 description: ID of the movie being shown
 *               capacity:
 *                 type: object
 *                 properties:
 *                   rows:
 *                     type: integer
 *                     description: Number of rows in the theater
 *                   cols:
 *                     type: integer
 *                     description: Number of columns in the theater
 *             required:
 *               - name
 *               - movieId
 *               - capacity
 *     responses:
 *       201:
 *         description: Theater created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 *       500:
 *         description: Internal server error
 */
router.post("/register", authMiddleware, roleMiddleware(['Admin']), validateRegisterTheater, registerTheater);

/**
 * @swagger
 * /theater/list:
 *   get:
 *     summary: Get a paginated list of all theaters with movie info and available seats
 *     tags:
 *       - Theater
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of theaters per page
 *     responses:
 *       200:
 *         description: List of theaters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       theaterId:
 *                         type: integer
 *                       movieTitle:
 *                         type: string
 *                       movieImage:
 *                         type: string
 *                       theaterName:
 *                         type: string
 *                       availableSeats:
 *                         type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/list', authMiddleware, listTheaters);

/**
 * @swagger
 * /theater/{id}:
 *   get:
 *     summary: Get theater details with the movie it shows
 *     tags:
 *       - Theater
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Theater details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 name: { type: string }
 *                 movieId: { type: integer }
 *                 capacity:
 *                   type: object
 *                   properties:
 *                     cols: { type: integer }
 *                     rows: { type: integer }
 *                 movie:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     title: { type: string }
 *                     posterImage: { type: string }
 *                     description: { type: string }
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, getTheaterById);

/**
 * @swagger
 * /theater/{id}/seats:
 *   get:
 *     summary: Get reserved seats for a specific theater on a specific date
 *     tags:
 *       - Theater
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the theater
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: "Date for which to get reserved seats (format: YYYY-MM-DD)"
 *     responses:
 *       200:
 *         description: List of reserved seats for the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   row: { type: integer }
 *                   col: { type: integer }
 *                   statusId: { type: integer, enum: [1, 2] } # 1: available, 2: reserved
 *       500:
 *         description: Internal server error
 */
router.get('/:id/seats', authMiddleware, getTheaterSeatsByDate);

/**
 * @swagger
 * /theater/{id}/capacity:
 *   put:
 *     summary: Actualiza la capacidad (rows x cols) de una sala
 *     tags: 
 *       - Theater
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sala
 *     requestBody:
 *       description: Nuevos valores de filas y columnas
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rows
 *               - cols
 *             properties:
 *               rows:
 *                 type: integer
 *                 example: 8
 *               cols:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       200:
 *         description: Capacidad actualizada
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno
 */
router.put(
  "/:id/capacity",
  authMiddleware,
  roleMiddleware(["Admin"]),
  updateTheaterCapacity
);

/**
 * @swagger
 * /theater/{id}:
 *   put:
 *     summary: Update a theater's details
 *     tags: 
 *       - Theater
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sala
 *     requestBody:
 *       description: Nuevos para nombre y pelicula
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - movieId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Avengers
 *               movieId:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       200:
 *         description: Sala actualizada
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno
 */
router.put("/:id", authMiddleware, roleMiddleware(["Admin"]), updateTheater);

export default router;