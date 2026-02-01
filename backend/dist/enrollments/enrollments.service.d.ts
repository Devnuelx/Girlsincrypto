import { PrismaService } from '../prisma/prisma.service';
import { CoursesService } from '../courses/courses.service';
import { UnlockSchedulerService } from './unlock-scheduler.service';
import { AccessService } from './access.service';
import { Enrollment } from '@prisma/client';
import { EnrollDto, UpdatePreferencesDto } from './dto/enrollment.dto';
export declare class EnrollmentsService {
    private readonly prisma;
    private readonly coursesService;
    private readonly unlockScheduler;
    private readonly accessService;
    constructor(prisma: PrismaService, coursesService: CoursesService, unlockScheduler: UnlockSchedulerService, accessService: AccessService);
    enroll(userId: string, dto: EnrollDto): Promise<Enrollment>;
    updatePreferences(userId: string, courseId: string, dto: UpdatePreferencesDto): Promise<Enrollment>;
    getEnrollment(userId: string, courseId: string): Promise<{
        accessInfo: {
            accessibleLessonIds: string[];
            upcomingUnlocks: Array<{
                lessonId: string;
                unlockAt: Date;
            }>;
        };
        progress: {
            completed: number;
            total: number;
            percentage: number;
        };
        course: {
            modules: ({
                lessons: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    description: string | null;
                    orderIndex: number;
                    contentUrl: string | null;
                    contentType: import(".prisma/client").$Enums.ContentType;
                    unlockOffset: number;
                    isPreviewable: boolean;
                    durationMinutes: number | null;
                    moduleId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                courseId: string;
                title: string;
                description: string | null;
                orderIndex: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tier: import(".prisma/client").$Enums.Tier;
            title: string;
            description: string | null;
            thumbnailUrl: string | null;
            isCapped: boolean;
            maxEnrollments: number | null;
            minDurationWeeks: number;
            maxLessonsPerWeek: number;
            allowDayChoice: boolean;
            slug: string;
            isPublished: boolean;
        };
        lessonUnlocks: ({
            lesson: {
                module: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    courseId: string;
                    title: string;
                    description: string | null;
                    orderIndex: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                orderIndex: number;
                contentUrl: string | null;
                contentType: import(".prisma/client").$Enums.ContentType;
                unlockOffset: number;
                isPreviewable: boolean;
                durationMinutes: number | null;
                moduleId: string;
            };
        } & {
            id: string;
            lessonId: string;
            enrollmentId: string;
            unlockAt: Date;
            isUnlocked: boolean;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        preferredDays: import(".prisma/client").$Enums.DayOfWeek[];
        startDate: Date;
        unlockPlan: import(".prisma/client").$Enums.UnlockPlanType;
        adminOverride: boolean;
        courseId: string;
        userId: string;
    } | null>;
    getUserEnrollments(userId: string): Promise<({
        course: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tier: import(".prisma/client").$Enums.Tier;
            title: string;
            description: string | null;
            thumbnailUrl: string | null;
            isCapped: boolean;
            maxEnrollments: number | null;
            minDurationWeeks: number;
            maxLessonsPerWeek: number;
            allowDayChoice: boolean;
            slug: string;
            isPublished: boolean;
        };
        lessonUnlocks: {
            id: string;
            lessonId: string;
            enrollmentId: string;
            unlockAt: Date;
            isUnlocked: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        preferredDays: import(".prisma/client").$Enums.DayOfWeek[];
        startDate: Date;
        unlockPlan: import(".prisma/client").$Enums.UnlockPlanType;
        adminOverride: boolean;
        courseId: string;
        userId: string;
    })[]>;
    setAdminOverride(userId: string, courseId: string, override: boolean): Promise<Enrollment>;
    private getProgress;
    markLessonComplete(userId: string, lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isCompleted: boolean;
        completedAt: Date | null;
        watchTime: number;
        lastPosition: number;
        lessonId: string;
    }>;
    updateWatchProgress(userId: string, lessonId: string, watchTime: number, lastPosition: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isCompleted: boolean;
        completedAt: Date | null;
        watchTime: number;
        lastPosition: number;
        lessonId: string;
    }>;
}
