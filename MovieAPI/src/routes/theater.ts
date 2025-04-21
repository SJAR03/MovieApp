import express, { Router } from "express";
import { authMiddleware } from "../middlewares/Auth/authMiddleware";
import { roleMiddleware } from "../middlewares/Auth/roleMiddleware";
import { registerTheater } from "../controllers/theaterController";
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

export default router;
