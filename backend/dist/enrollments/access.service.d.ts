import { PrismaService } from '../prisma/prisma.service';
import { Tier } from '@prisma/client';
export interface AccessCheckInput {
    userId: string;
    courseId: string;
    lessonId?: string;
}
export interface AccessResult {
    hasAccess: boolean;
    accessType: 'ADMIN_OVERRIDE' | 'TIER_PURCHASE' | 'NONE';
    userTier?: Tier | null;
    requiredTier?: Tier;
    reason?: string;
}
export declare class AccessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkAccess(input: AccessCheckInput): Promise<AccessResult>;
    getUserHighestTier(userId: string): Promise<Tier | null>;
    checkLessonUnlock(enrollmentId: string, lessonId: string): Promise<{
        isUnlocked: boolean;
        unlockAt?: Date;
    }>;
    getAccessibleLessons(userId: string, courseId: string): Promise<{
        accessibleLessonIds: string[];
        upcomingUnlocks: Array<{
            lessonId: string;
            unlockAt: Date;
        }>;
    }>;
    canEnrollInCourse(userId: string, courseId: string): Promise<{
        canEnroll: boolean;
        reason?: string;
    }>;
}
