import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async findAll(
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ) {
        const users = await this.usersService.findAll({
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 50,
            orderBy: { createdAt: 'desc' },
        });
        const total = await this.usersService.count();
        return { users, total };
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async remove(@Param('id') id: string) {
        await this.usersService.delete(id);
        return { message: 'User deleted successfully' };
    }

    @Patch('me/profile')
    async updateProfile(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
        const allowedUpdates = {
            firstName: dto.firstName,
            lastName: dto.lastName,
            timezone: dto.timezone,
        };
        return this.usersService.update(user.id, allowedUpdates);
    }
}
