import { Request } from "express";
import { PaginationParams } from "../types/pagination";

export const getPaginationParams = (req: Request): PaginationParams => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}