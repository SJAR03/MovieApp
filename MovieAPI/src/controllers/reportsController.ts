import { Request, Response, NextFunction } from "express";
import { getSalesReportService } from "../services/reportsService";

export const getSalesReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const report = await getSalesReportService();
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};
