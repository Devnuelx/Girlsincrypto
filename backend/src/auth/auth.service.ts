import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
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

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto): Promise<AuthResponse> {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await bcrypt.hash(dto.password, 12);

        const user = await this.usersService.create({
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            timezone: dto.timezone,
        });

        const accessToken = this.generateToken(user);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            accessToken,
        };
    }

    async login(dto: LoginDto): Promise<AuthResponse> {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = this.generateToken(user);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            accessToken,
        };
    }

    async validateUser(payload: JwtPayload) {
        const user = await this.usersService.findById(payload.sub);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }
        return user;
    }

    private generateToken(user: { id: string; email: string; role: Role }): string {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
}
