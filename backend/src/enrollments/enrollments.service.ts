import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoursesService } from '../courses/courses.service';
import { UnlockSchedulerService } from './unlock-scheduler.service';
import { AccessService } from './access.service';
import { Enrollment, DayOfWeek, UnlockPlanType } from '@prisma/client';
import { EnrollDto, UpdatePreferencesDto } from './dto/enrollment.dto';

@Injectable()
export class EnrollmentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly coursesService: CoursesService,
        private readonly unlockScheduler: UnlockSchedulerService,
        private readonly accessService: AccessService,
    ) { }

    async enroll(userId: string, dto: EnrollDto): Promise<Enrollment> {
        const { courseId, preferredDays, startDate } = dto;

        const course = await this.coursesService.findCourseById(courseId);
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        const existing = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (existing) {
            throw new ConflictException('Already enrolled in this course');
        }

        const days: DayOfWeek[] = preferredDays && preferredDays.length > 0
            ? preferredDays
            : [DayOfWeek.MON, DayOfWeek.WED, DayOfWeek.FRI];

        const lessons = await this.coursesService.getAllLessonsForCourse(courseId);
        if (lessons.length === 0) {
            throw new BadRequestException('Course has no lessons');
        }

        const unlockPlan = course.allowDayChoice
            ? UnlockPlanType.GENERATED
            : UnlockPlanType.FIXED;

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

    async updatePreferences(
        userId: string,
        courseId: string,
        dto: UpdatePreferencesDto,
    ): Promise<Enrollment> {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
            include: {
                lessonUnlocks: true,
                course: true,
            },
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        if (enrollment.unlockPlan === UnlockPlanType.FIXED) {
            throw new BadRequestException('This course does not allow day preference changes');
        }

        const lessons = await this.coursesService.getAllLessonsForCourse(courseId);

        const newSchedule = this.unlockScheduler.recalculateUnlockSchedule(
            enrollment.lessonUnlocks,
            lessons.map(l => ({ id: l.id, orderIndex: l.orderIndex })),
            dto.preferredDays,
            enrollment.course.minDurationWeeks,
        );

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
        }) as Promise<Enrollment>;
    }

    async getEnrollment(userId: string, courseId: string) {
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

        if (!enrollment) return null;

        const accessInfo = await this.accessService.getAccessibleLessons(userId, courseId);
        const progress = await this.getProgress(userId, courseId);

        return {
            ...enrollment,
            accessInfo,
            progress,
        };
    }

    async getUserEnrollments(userId: string) {
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

    async setAdminOverride(
        userId: string,
        courseId: string,
        override: boolean,
    ): Promise<Enrollment> {
        return this.prisma.enrollment.update({
            where: { userId_courseId: { userId, courseId } },
            data: { adminOverride: override },
        });
    }

    private async getProgress(userId: string, courseId: string) {
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

    async markLessonComplete(userId: string, lessonId: string) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { module: true },
        });

        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        const access = await this.accessService.checkAccess({
            userId,
            courseId: lesson.module.courseId,
            lessonId,
        });

        if (!access.hasAccess) {
            throw new BadRequestException(`Cannot access lesson: ${access.reason}`);
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

    async updateWatchProgress(
        userId: string,
        lessonId: string,
        watchTime: number,
        lastPosition: number,
    ) {
        return this.prisma.progress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            update: { watchTime, lastPosition },
            create: { userId, lessonId, watchTime, lastPosition },
        });
    }
}
