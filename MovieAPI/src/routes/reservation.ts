import express, { Router } from "express";
import { authMiddleware } from "../middlewares/Auth/authMiddleware";
import { validateReservationRegister } from "../middlewares/Reservation/validateReservationRegister";
import { registerReservation } from "../controllers/reservationController";

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reservation
 *   description: Endpoints for managing reservations
 */

/**
 * @swagger
 * /reservation/register:
 *   post:
 *     tags:
 *       - Reservation
 *     summary: Register a new reservation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theaterId:
 *                 type: integer
 *               reservationDate:
 *                 type: string
 *                 format: date
 *               seatsId:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Invalid data or reservation failed
 *       500:
 *         description: Internal server error
 */
router.post("/register", authMiddleware, validateReservationRegister, registerReservation);

export default router;
