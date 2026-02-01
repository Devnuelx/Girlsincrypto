import { EnrollmentsService } from './enrollments.service';
import { AccessService } from './access.service';
import { User } from '@prisma/client';
import { EnrollDto, UpdatePreferencesDto } from './dto/enrollment.dto';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    private readonly accessService;
    constructor(enrollmentsService: EnrollmentsService, accessService: AccessService);
    enroll(user: User, dto: EnrollDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        preferredDays: import(".prisma/client").$Enums.DayOfWeek[];
        startDate: Date;
        unlockPlan: import(".prisma/client").$Enums.UnlockPlanType;
        adminOverride: boolean;
        courseId: string;
        userId: string;
    }>;
    getMyEnrollments(user: User): Promise<({
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
    getMyEnrollment(user: User, courseId: string): Promise<{
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
    updatePreferences(user: User, courseId: string, dto: UpdatePreferencesDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        preferredDays: import(".prisma/client").$Enums.DayOfWeek[];
        startDate: Date;
        unlockPlan: import(".prisma/client").$Enums.UnlockPlanType;
        adminOverride: boolean;
        courseId: string;
        userId: string;
    }>;
    checkLessonAccess(user: User, courseId: string, lessonId: string): Promise<import("./access.service").AccessResult>;
    markComplete(user: User, lessonId: string): Promise<{
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
    updateWatch(user: User, lessonId: string, dto: {
        watchTime: number;
        lastPosition: number;
    }): Promise<{
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
    setOverride(userId: string, courseId: string, override: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        preferredDays: import(".prisma/client").$Enums.DayOfWeek[];
        startDate: Date;
        unlockPlan: import(".prisma/client").$Enums.UnlockPlanType;
        adminOverride: boolean;
        courseId: string;
        userId: string;
    }>;
}
