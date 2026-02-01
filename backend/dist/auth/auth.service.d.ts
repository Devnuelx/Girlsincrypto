import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Role } from '@prisma/client';
export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
}
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: Role;
    };
    accessToken: string;
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    validateUser(payload: JwtPayload): Promise<{
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
    private generateToken;
}
