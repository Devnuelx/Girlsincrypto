import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Get()
    async findAll(@Query('published') published?: string) {
        const isPublished = published === 'true' ? true : published === 'false' ? false : undefined;
        return this.coursesService.findAllCourses({ published: isPublished });
    }

    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.coursesService.findCourseBySlug(slug);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.coursesService.findCourseById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async create(@Body() dto: CreateCourseDto) {
        return this.coursesService.createCourse(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
        return this.coursesService.updateCourse(id, dto);
    }

    @Patch(':id/publish')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async publish(@Param('id') id: string, @Body('publish') publish: boolean) {
        return this.coursesService.publishCourse(id, publish);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async remove(@Param('id') id: string) {
        await this.coursesService.deleteCourse(id);
        return { message: 'Course deleted successfully' };
    }
}
