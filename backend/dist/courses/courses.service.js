"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCourse(dto) {
        const slug = this.generateSlug(dto.title);
        return this.prisma.course.create({
            data: {
                title: dto.title,
                slug,
                description: dto.description,
                thumbnailUrl: dto.thumbnailUrl,
                tier: dto.tier || client_1.Tier.HEIRESS,
                isCapped: dto.isCapped ?? false,
                maxEnrollments: dto.maxEnrollments,
                minDurationWeeks: dto.minDurationWeeks || 4,
                maxLessonsPerWeek: dto.maxLessonsPerWeek || 5,
                allowDayChoice: dto.allowDayChoice ?? true,
            },
        });
    }
    async findAllCourses(params) {
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
    async findCourseById(id) {
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
    async findCourseBySlug(slug) {
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
    async updateCourse(id, dto) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        const data = { ...dto };
        if (dto.title && dto.title !== course.title) {
            data.slug = this.generateSlug(dto.title);
        }
        return this.prisma.course.update({
            where: { id },
            data,
        });
    }
    async deleteCourse(id) {
        await this.prisma.course.delete({ where: { id } });
    }
    async publishCourse(id, publish) {
        return this.prisma.course.update({
            where: { id },
            data: { isPublished: publish },
        });
    }
    async createModule(courseId, dto) {
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
    async findModuleById(id) {
        return this.prisma.module.findUnique({
            where: { id },
            include: {
                lessons: {
                    orderBy: { orderIndex: 'asc' },
                },
            },
        });
    }
    async updateModule(id, dto) {
        return this.prisma.module.update({
            where: { id },
            data: dto,
        });
    }
    async deleteModule(id) {
        await this.prisma.module.delete({ where: { id } });
    }
    async reorderModules(courseId, moduleIds) {
        await this.prisma.$transaction(moduleIds.map((id, index) => this.prisma.module.update({
            where: { id },
            data: { orderIndex: index },
        })));
    }
    async createLesson(moduleId, dto) {
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
    async findLessonById(id) {
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
    async updateLesson(id, dto) {
        return this.prisma.lesson.update({
            where: { id },
            data: dto,
        });
    }
    async deleteLesson(id) {
        await this.prisma.lesson.delete({ where: { id } });
    }
    async reorderLessons(moduleId, lessonIds) {
        await this.prisma.$transaction(lessonIds.map((id, index) => this.prisma.lesson.update({
            where: { id },
            data: { orderIndex: index, unlockOffset: index },
        })));
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async getTotalLessonsForCourse(courseId) {
        return this.prisma.lesson.count({
            where: {
                module: {
                    courseId,
                },
            },
        });
    }
    async getAllLessonsForCourse(courseId) {
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
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map