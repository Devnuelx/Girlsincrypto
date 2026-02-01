import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';

@Controller('courses/:courseId/modules')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ModulesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    async create(
        @Param('courseId') courseId: string,
        @Body() dto: CreateModuleDto,
    ) {
        return this.coursesService.createModule(courseId, dto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.coursesService.findModuleById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
        return this.coursesService.updateModule(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.coursesService.deleteModule(id);
        return { message: 'Module deleted successfully' };
    }

    @Post('reorder')
    async reorder(
        @Param('courseId') courseId: string,
        @Body('moduleIds') moduleIds: string[],
    ) {
        await this.coursesService.reorderModules(courseId, moduleIds);
        return { message: 'Modules reordered successfully' };
    }
}
