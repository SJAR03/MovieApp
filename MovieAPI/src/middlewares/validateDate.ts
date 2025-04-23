import { Request, Response, NextFunction } from "express";

export const validateDateQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { date } = req.query;

  if (!date || isNaN(Date.parse(date as string))) {
    return res
      .status(400)
      .json({
        message: "Invalid or missing date query param. Use YYYY-MM-DD.",
      });
  }

  next();
};
