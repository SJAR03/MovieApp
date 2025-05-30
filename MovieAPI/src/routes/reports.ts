import express, { Router } from "express";
import { authMiddleware } from "../middlewares/Auth/authMiddleware";
import { roleMiddleware } from "../middlewares/Auth/roleMiddleware";
import { getSalesReport } from "../controllers/reportsController";

const router: Router = express.Router();

/**
 * @swagger
 * /reports/sales:
 *   get:
 *     summary: Get activity report for next 8 days
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity report retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 *       500:
 *         description: Internal server error
 */
router.get("/sales", authMiddleware, roleMiddleware(["Admin"]), getSalesReport);

export default router;