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
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination (optional)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of users per page (optional)
 *     responses:
 *       200:
 *         description: Users listed successfully
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
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
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
 *       404:
 *         description: No users found
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