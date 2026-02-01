import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(skip?: number, take?: number): Promise<{
        users: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.Role;
            timezone: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.Role;
        timezone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.Role;
        timezone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateProfile(user: User, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.Role;
        timezone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
