import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Course, Module, Lesson, Prisma, Tier } from '@prisma/client';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Injectable()
export class CoursesService {
    constructor(private readonly prisma: PrismaService) { }

    async createCourse(dto: CreateCourseDto): Promise<Course> {
        const slug = this.generateSlug(dto.title);
        return this.prisma.course.create({
            data: {
                title: dto.title,
                slug,
                description: dto.description,
                thumbnailUrl: dto.thumbnailUrl,
                tier: dto.tier || Tier.HEIRESS,
                isCapped: dto.isCapped ?? false,
                maxEnrollments: dto.maxEnrollments,
                minDurationWeeks: dto.minDurationWeeks || 4,
                maxLessonsPerWeek: dto.maxLessonsPerWeek || 5,
                allowDayChoice: dto.allowDayChoice ?? true,
            },
        });
    }

    async findAllCourses(params?: {
        published?: boolean;
        skip?: number;
        take?: number;
    }): Promise<Course[]> {
        return this.prisma.course.findMany({
            where: params?.published !== undefined ? { isPublished: params.published } : undefined,
            skip: params?.skip,
            take: params?.take,
            orderBy: { createdAt: 'desc' },
            include: {
                modules: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { orderIndex: 'asc' },
                        },
                    },
                },
                _count: {
                    select: { enrollments: true },
                },
            },
        });
    }

    async findCourseById(id: string): Promise<Course | null> {
        return this.prisma.course.findUnique({
            where: { id },
            include: {
                modules: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { orderIndex: 'asc' },
                        },
                    },
                },
            },
        });
    }

    async findCourseBySlug(slug: string): Promise<Course | null> {
        return this.prisma.course.findUnique({
            where: { slug },
            include: {
                modules: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { orderIndex: 'asc' },
                        },
                    },
                },
            },
        });
    }

    async updateCourse(id: string, dto: UpdateCourseDto): Promise<Course> {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course) throw new NotFoundException('Course not found');

        const data: Prisma.CourseUpdateInput = { ...dto };
        if (dto.title && dto.title !== course.title) {
            data.slug = this.generateSlug(dto.title);
        }

        return this.prisma.course.update({
            where: { id },
            data,
        });
    }

    async deleteCourse(id: string): Promise<void> {
        await this.prisma.course.delete({ where: { id } });
    }

    async publishCourse(id: string, publish: boolean): Promise<Course> {
        return this.prisma.course.update({
            where: { id },
            data: { isPublished: publish },
        });
    }

    async createModule(courseId: string, dto: CreateModuleDto): Promise<Module> {
        const maxOrder = await this.prisma.module.aggregate({
            where: { courseId },
            _max: { orderIndex: true },
        });
        const orderIndex = dto.orderIndex ?? (maxOrder._max.orderIndex ?? -1) + 1;

        return this.prisma.module.create({
            data: {
                courseId,
                title: dto.title,
                description: dto.description,
                orderIndex,
            },
        });
    }

    async findModuleById(id: string): Promise<Module | null> {
        return this.prisma.module.findUnique({
            where: { id },
            include: {
                lessons: {
                    orderBy: { orderIndex: 'asc' },
                },
            },
        });
    }

    async updateModule(id: string, dto: UpdateModuleDto): Promise<Module> {
        return this.prisma.module.update({
            where: { id },
            data: dto,
        });
    }

    async deleteModule(id: string): Promise<void> {
        await this.prisma.module.delete({ where: { id } });
    }

    async reorderModules(courseId: string, moduleIds: string[]): Promise<void> {
        await this.prisma.$transaction(
            moduleIds.map((id, index) =>
                this.prisma.module.update({
                    where: { id },
                    data: { orderIndex: index },
                }),
            ),
        );
    }

    async createLesson(moduleId: string, dto: CreateLessonDto): Promise<Lesson> {
        const maxOrder = await this.prisma.lesson.aggregate({
            where: { moduleId },
            _max: { orderIndex: true },
        });
        const orderIndex = dto.orderIndex ?? (maxOrder._max.orderIndex ?? -1) + 1;

        return this.prisma.lesson.create({
            data: {
                moduleId,
                title: dto.title,
                description: dto.description,
                contentUrl: dto.contentUrl,
                contentType: dto.contentType,
                orderIndex,
                unlockOffset: dto.unlockOffset ?? orderIndex,
                isPreviewable: dto.isPreviewable ?? false,
                durationMinutes: dto.durationMinutes,
            },
        });
    }

    async findLessonById(id: string): Promise<Lesson | null> {
        return this.prisma.lesson.findUnique({
            where: { id },
            include: {
                module: {
                    include: {
                        course: true,
                    },
                },
            },
        });
    }

    async updateLesson(id: string, dto: UpdateLessonDto): Promise<Lesson> {
        return this.prisma.lesson.update({
            where: { id },
            data: dto,
        });
    }

    async deleteLesson(id: string): Promise<void> {
        await this.prisma.lesson.delete({ where: { id } });
    }

    async reorderLessons(moduleId: string, lessonIds: string[]): Promise<void> {
        await this.prisma.$transaction(
            lessonIds.map((id, index) =>
                this.prisma.lesson.update({
                    where: { id },
                    data: { orderIndex: index, unlockOffset: index },
                }),
            ),
        );
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    async getTotalLessonsForCourse(courseId: string): Promise<number> {
        return this.prisma.lesson.count({
            where: {
                module: {
                    courseId,
                },
            },
        });
    }

    async getAllLessonsForCourse(courseId: string): Promise<Lesson[]> {
        return this.prisma.lesson.findMany({
            where: {
                module: {
                    courseId,
                },
            },
            orderBy: [
                { module: { orderIndex: 'asc' } },
                { orderIndex: 'asc' },
            ],
        });
    }
}
