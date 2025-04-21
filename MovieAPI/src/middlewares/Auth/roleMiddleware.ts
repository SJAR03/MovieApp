import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../utils/ApiError";


export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    const userRoles = req.user.roles;
    const hasRequiredRole = roles.some((role) => userRoles.includes(role));
    if (!hasRequiredRole) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    next();
  };
};
