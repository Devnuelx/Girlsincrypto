import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tier } from '@prisma/client';
import { isBefore } from 'date-fns';

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

// Tier hierarchy: SOVEREIGN > EMPRESS > HEIRESS
const TIER_LEVEL: Record<Tier, number> = {
    HEIRESS: 1,
    EMPRESS: 2,
    SOVEREIGN: 3,
};

@Injectable()
export class AccessService {
    constructor(private readonly prisma: PrismaService) { }

    async checkAccess(input: AccessCheckInput): Promise<AccessResult> {
        const { userId, courseId, lessonId } = input;

        // Check for admin override on enrollment
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });

        if (enrollment?.adminOverride) {
            return { hasAccess: true, accessType: 'ADMIN_OVERRIDE' };
        }

        // Get course to check required tier
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return { hasAccess: false, accessType: 'NONE', reason: 'Course not found' };
        }

        // Get user's highest purchased tier
        const userTier = await this.getUserHighestTier(userId);

        if (!userTier) {
            return {
                hasAccess: false,
                accessType: 'NONE',
                requiredTier: course.tier,
                reason: 'No tier purchased',
            };
        }

        // Check if user's tier level is >= course tier level
        const hasAccess = TIER_LEVEL[userTier] >= TIER_LEVEL[course.tier];

        if (!hasAccess) {
            return {
                hasAccess: false,
                accessType: 'NONE',
                userTier,
                requiredTier: course.tier,
                reason: `Requires ${course.tier} tier or higher`,
            };
        }

        // If checking specific lesson, verify unlock schedule
        if (lessonId && enrollment) {
            const lessonAccess = await this.checkLessonUnlock(enrollment.id, lessonId);
            if (!lessonAccess.isUnlocked) {
                return {
                    hasAccess: false,
                    accessType: 'TIER_PURCHASE',
                    userTier,
                    reason: `Lesson unlocks on ${lessonAccess.unlockAt?.toLocaleDateString()}`,
                };
            }
        }

        return { hasAccess: true, accessType: 'TIER_PURCHASE', userTier };
    }

    async getUserHighestTier(userId: string): Promise<Tier | null> {
        const purchases = await this.prisma.tierPurchase.findMany({
            where: { userId },
            select: { tier: true },
        });

        if (purchases.length === 0) return null;

        // Find highest tier
        let highestLevel = 0;
        let highestTier: Tier = 'HEIRESS';

        for (const purchase of purchases) {
            const level = TIER_LEVEL[purchase.tier];
            if (level > highestLevel) {
                highestLevel = level;
                highestTier = purchase.tier;
            }
        }

        return highestTier;
    }

    async checkLessonUnlock(enrollmentId: string, lessonId: string): Promise<{
        isUnlocked: boolean;
        unlockAt?: Date;
    }> {
        const unlock = await this.prisma.lessonUnlock.findUnique({
            where: {
                enrollmentId_lessonId: { enrollmentId, lessonId },
            },
        });

        if (!unlock) {
            return { isUnlocked: true };
        }

        const now = new Date();
        const isUnlocked = unlock.isUnlocked || isBefore(new Date(unlock.unlockAt), now);

        return {
            isUnlocked,
            unlockAt: new Date(unlock.unlockAt),
        };
    }

    async getAccessibleLessons(userId: string, courseId: string): Promise<{
        accessibleLessonIds: string[];
        upcomingUnlocks: Array<{ lessonId: string; unlockAt: Date }>;
    }> {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
            include: {
                lessonUnlocks: true,
            },
        });

        if (!enrollment) {
            return { accessibleLessonIds: [], upcomingUnlocks: [] };
        }

        const now = new Date();
        const accessible: string[] = [];
        const upcoming: Array<{ lessonId: string; unlockAt: Date }> = [];

        for (const unlock of enrollment.lessonUnlocks) {
            if (unlock.isUnlocked || isBefore(new Date(unlock.unlockAt), now)) {
                accessible.push(unlock.lessonId);
            } else {
                upcoming.push({
                    lessonId: unlock.lessonId,
                    unlockAt: new Date(unlock.unlockAt),
                });
            }
        }

        upcoming.sort((a, b) => a.unlockAt.getTime() - b.unlockAt.getTime());

        return {
            accessibleLessonIds: accessible,
            upcomingUnlocks: upcoming,
        };
    }

    async canEnrollInCourse(userId: string, courseId: string): Promise<{
        canEnroll: boolean;
        reason?: string;
    }> {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                _count: { select: { enrollments: true } },
            },
        });

        if (!course) {
            return { canEnroll: false, reason: 'Course not found' };
        }

        // Check if user has required tier
        const userTier = await this.getUserHighestTier(userId);
        if (!userTier || TIER_LEVEL[userTier] < TIER_LEVEL[course.tier]) {
            return { canEnroll: false, reason: `Requires ${course.tier} tier or higher` };
        }

        // Check if course is capped
        if (course.isCapped && course.maxEnrollments) {
            if (course._count.enrollments >= course.maxEnrollments) {
                return { canEnroll: false, reason: 'Course enrollment is full' };
            }
        }

        return { canEnroll: true };
    }
}
