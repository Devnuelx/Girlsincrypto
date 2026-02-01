import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: {
        email: string;
        passwordHash: string;
        firstName?: string;
        lastName?: string;
        timezone?: string;
        role?: Role;
    }): Promise<User> {
        return this.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                timezone: data.timezone || 'UTC',
                role: data.role || Role.STUDENT,
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        return this.prisma.user.findMany({
            ...params,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                timezone: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                passwordHash: false,
            },
        }) as unknown as User[];
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }

    async count(where?: Prisma.UserWhereInput): Promise<number> {
        return this.prisma.user.count({ where });
    }
}
