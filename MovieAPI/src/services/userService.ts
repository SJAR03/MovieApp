import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/ApiError';

export interface ActiveUsersResult {
  users: { id: number; name: string; username: string, email: string }[];
  total: number;
}

const prisma = new PrismaClient();

export const listActiveUsersService = async (skip: number, limit: number): Promise<ActiveUsersResult> => {
    if (limit > 0) {
        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where: { status: true },
                select: { id: true, name: true, username: true, email: true },
                skip,
                take: limit,
            }),
            prisma.user.count({ where: { status: true } }),
        ]);
        return { users, total };
    } else {
        const users = await prisma.user.findMany({
            where: { status: true },
            select: { id: true, name: true, username: true, email: true },
        });
        return { users, total: users.length };
    }
}

export const disableUserService = async (userId: number) => {
    const user = await prisma.user.findUnique({where: {id: userId}});
    if (!user) {
        throw new NotFoundError('User not found');
    }
    await prisma.user.update({where: {id: userId}, data: {status: false}});
}