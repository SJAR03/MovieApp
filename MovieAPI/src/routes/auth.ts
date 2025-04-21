import express, { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController";
import { validateRegisterUser } from "../middlewares/Auth/validateRegisterUser";

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for user authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: 
 *       - Auth
 *     summary: Register a new user
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post("/register", validateRegisterUser, registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: 
 *       - Auth
 *     summary: Login and get a token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginUser);

export default router;
