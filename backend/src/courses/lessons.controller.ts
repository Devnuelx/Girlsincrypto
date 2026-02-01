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
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Controller('modules/:moduleId/lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class LessonsController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    async create(
        @Param('moduleId') moduleId: string,
        @Body() dto: CreateLessonDto,
    ) {
        return this.coursesService.createLesson(moduleId, dto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.coursesService.findLessonById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
        return this.coursesService.updateLesson(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.coursesService.deleteLesson(id);
        return { message: 'Lesson deleted successfully' };
    }

    @Post('reorder')
    async reorder(
        @Param('moduleId') moduleId: string,
        @Body('lessonIds') lessonIds: string[],
    ) {
        await this.coursesService.reorderLessons(moduleId, lessonIds);
        return { message: 'Lessons reordered successfully' };
    }
}
