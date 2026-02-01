import { Role } from '@prisma/client';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    timezone?: string;
    isActive?: boolean;
    role?: Role;
}
