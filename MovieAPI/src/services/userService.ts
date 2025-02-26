import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/ApiError';

const prisma = new PrismaClient();

export const listActiveUsersService = async () => {
    return prisma.user.findMany({
        where: {status: true}, 
        select: {
            id: true,
            name: true,
            email: true,
    }});
}

export const disableUserService = async (userId: number) => {
    const user = await prisma.user.findUnique({where: {id: userId}});
    if (!user) {
        throw new NotFoundError('User not found');
    }
    await prisma.user.update({where: {id: userId}, data: {status: false}});
}