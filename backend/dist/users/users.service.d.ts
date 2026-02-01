import { PrismaService } from '../prisma/prisma.service';
import { User, Role, Prisma } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        passwordHash: string;
        firstName?: string;
        lastName?: string;
        timezone?: string;
        role?: Role;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    delete(id: string): Promise<void>;
    count(where?: Prisma.UserWhereInput): Promise<number>;
}
