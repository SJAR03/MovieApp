import express, { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { disableUser, listActiveUsers } from "../controllers/userController";


const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints for user management
 */

/**
 * @swagger
 * /user/activeUsers:
 *   get:
 *     tags: 
 *       - User
 *     summary: List all active users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Users listed successfully
 *       500:
 *         description: Internal server error
 */
router.get('/activeUsers', authMiddleware, roleMiddleware(['Admin']), listActiveUsers);

/**
 * @swagger
 * /user/inactiveUser/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Inactive selected user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The Id of the user to disable
 *     responses:
 *       201:
 *         description: User inactive successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/inactiveUser/:id', authMiddleware, roleMiddleware(['Admin']), disableUser);

export default router;