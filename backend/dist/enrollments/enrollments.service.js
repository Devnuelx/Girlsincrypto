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
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const courses_service_1 = require("../courses/courses.service");
const unlock_scheduler_service_1 = require("./unlock-scheduler.service");
const access_service_1 = require("./access.service");
const client_1 = require("@prisma/client");
let EnrollmentsService = class EnrollmentsService {
    constructor(prisma, coursesService, unlockScheduler, accessService) {
        this.prisma = prisma;
        this.coursesService = coursesService;
        this.unlockScheduler = unlockScheduler;
        this.accessService = accessService;
    }
    async enroll(userId, dto) {
        const { courseId, preferredDays, startDate } = dto;
        const course = await this.coursesService.findCourseById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const existing = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (existing) {
            throw new common_1.ConflictException('Already enrolled in this course');
        }
        const days = preferredDays && preferredDays.length > 0
            ? preferredDays
            : [client_1.DayOfWeek.MON, client_1.DayOfWeek.WED, client_1.DayOfWeek.FRI];
        const lessons = await this.coursesService.getAllLessonsForCourse(courseId);
        if (lessons.length === 0) {
            throw new common_1.BadRequestException('Course has no lessons');
        }
        const unlockPlan = course.allowDayChoice
            ? client_1.UnlockPlanType.GENERATED
            : client_1.UnlockPlanType.FIXED;
        const unlockSchedule = this.unlockScheduler.generateUnlockSchedule({
            lessons: lessons.map(l => ({ id: l.id, orderIndex: l.orderIndex })),
            preferredDays: days,
            startDate: startDate ? new Date(startDate) : new Date(),
            minDurationWeeks: course.minDurationWeeks,
            timezone: 'UTC',
        });
        return this.prisma.enrollment.create({
            data: {
                userId,
                courseId,
                preferredDays: days,
                startDate: startDate ? new Date(startDate) : new Date(),
                unlockPlan,
                lessonUnlocks: {
                    create: unlockSchedule.map(u => ({
                        lessonId: u.lessonId,
                        unlockAt: u.unlockAt,
                        isUnlocked: u.isUnlocked,
                    })),
                },
            },
            include: {
                lessonUnlocks: {
                    orderBy: { unlockAt: 'asc' },
                },
                course: true,
            },
        });
    }
    async updatePreferences(userId, courseId, dto) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
            include: {
                lessonUnlocks: true,
                course: true,
            },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        if (enrollment.unlockPlan === client_1.UnlockPlanType.FIXED) {
            throw new common_1.BadRequestException('This course does not allow day preference changes');
        }
        const lessons = await this.coursesService.getAllLessonsForCourse(courseId);
        const newSchedule = this.unlockScheduler.recalculateUnlockSchedule(enrollment.lessonUnlocks, lessons.map(l => ({ id: l.id, orderIndex: l.orderIndex })), dto.preferredDays, enrollment.course.minDurationWeeks);
        return this.prisma.$transaction(async (tx) => {
            await tx.enrollment.update({
                where: { id: enrollment.id },
                data: { preferredDays: dto.preferredDays },
            });
            for (const unlock of newSchedule) {
                await tx.lessonUnlock.upsert({
                    where: {
                        enrollmentId_lessonId: {
                            enrollmentId: enrollment.id,
                            lessonId: unlock.lessonId,
                        },
                    },
                    update: {
                        unlockAt: unlock.unlockAt,
                        isUnlocked: unlock.isUnlocked,
                    },
                    create: {
                        enrollmentId: enrollment.id,
                        lessonId: unlock.lessonId,
                        unlockAt: unlock.unlockAt,
                        isUnlocked: unlock.isUnlocked,
                    },
                });
            }
            return tx.enrollment.findUnique({
                where: { id: enrollment.id },
                include: {
                    lessonUnlocks: { orderBy: { unlockAt: 'asc' } },
                    course: true,
                },
            });
        });
    }
    async getEnrollment(userId, courseId) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
            include: {
                lessonUnlocks: {
                    orderBy: { unlockAt: 'asc' },
                    include: {
                        lesson: {
                            include: {
                                module: true,
                            },
                        },
                    },
                },
                course: {
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
                },
            },
        });
        if (!enrollment)
            return null;
        const accessInfo = await this.accessService.getAccessibleLessons(userId, courseId);
        const progress = await this.getProgress(userId, courseId);
        return {
            ...enrollment,
            accessInfo,
            progress,
        };
    }
    async getUserEnrollments(userId) {
        return this.prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: true,
                lessonUnlocks: {
                    orderBy: { unlockAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async setAdminOverride(userId, courseId, override) {
        return this.prisma.enrollment.update({
            where: { userId_courseId: { userId, courseId } },
            data: { adminOverride: override },
        });
    }
    async getProgress(userId, courseId) {
        const [completed, total] = await Promise.all([
            this.prisma.progress.count({
                where: {
                    userId,
                    isCompleted: true,
                    lesson: { module: { courseId } },
                },
            }),
            this.prisma.lesson.count({
                where: { module: { courseId } },
            }),
        ]);
        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
    }
    async markLessonComplete(userId, lessonId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { module: true },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        const access = await this.accessService.checkAccess({
            userId,
            courseId: lesson.module.courseId,
            lessonId,
        });
        if (!access.hasAccess) {
            throw new common_1.BadRequestException(`Cannot access lesson: ${access.reason}`);
        }
        return this.prisma.progress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            update: {
                isCompleted: true,
                completedAt: new Date(),
            },
            create: {
                userId,
                lessonId,
                isCompleted: true,
                completedAt: new Date(),
            },
        });
    }
    async updateWatchProgress(userId, lessonId, watchTime, lastPosition) {
        return this.prisma.progress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            update: { watchTime, lastPosition },
            create: { userId, lessonId, watchTime, lastPosition },
        });
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        courses_service_1.CoursesService,
        unlock_scheduler_service_1.UnlockSchedulerService,
        access_service_1.AccessService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map