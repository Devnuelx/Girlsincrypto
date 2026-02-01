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
exports.AccessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_fns_1 = require("date-fns");
const TIER_LEVEL = {
    HEIRESS: 1,
    EMPRESS: 2,
    SOVEREIGN: 3,
};
let AccessService = class AccessService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAccess(input) {
        const { userId, courseId, lessonId } = input;
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (enrollment?.adminOverride) {
            return { hasAccess: true, accessType: 'ADMIN_OVERRIDE' };
        }
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            return { hasAccess: false, accessType: 'NONE', reason: 'Course not found' };
        }
        const userTier = await this.getUserHighestTier(userId);
        if (!userTier) {
            return {
                hasAccess: false,
                accessType: 'NONE',
                requiredTier: course.tier,
                reason: 'No tier purchased',
            };
        }
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
    async getUserHighestTier(userId) {
        const purchases = await this.prisma.tierPurchase.findMany({
            where: { userId },
            select: { tier: true },
        });
        if (purchases.length === 0)
            return null;
        let highestLevel = 0;
        let highestTier = 'HEIRESS';
        for (const purchase of purchases) {
            const level = TIER_LEVEL[purchase.tier];
            if (level > highestLevel) {
                highestLevel = level;
                highestTier = purchase.tier;
            }
        }
        return highestTier;
    }
    async checkLessonUnlock(enrollmentId, lessonId) {
        const unlock = await this.prisma.lessonUnlock.findUnique({
            where: {
                enrollmentId_lessonId: { enrollmentId, lessonId },
            },
        });
        if (!unlock) {
            return { isUnlocked: true };
        }
        const now = new Date();
        const isUnlocked = unlock.isUnlocked || (0, date_fns_1.isBefore)(new Date(unlock.unlockAt), now);
        return {
            isUnlocked,
            unlockAt: new Date(unlock.unlockAt),
        };
    }
    async getAccessibleLessons(userId, courseId) {
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
        const accessible = [];
        const upcoming = [];
        for (const unlock of enrollment.lessonUnlocks) {
            if (unlock.isUnlocked || (0, date_fns_1.isBefore)(new Date(unlock.unlockAt), now)) {
                accessible.push(unlock.lessonId);
            }
            else {
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
    async canEnrollInCourse(userId, courseId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                _count: { select: { enrollments: true } },
            },
        });
        if (!course) {
            return { canEnroll: false, reason: 'Course not found' };
        }
        const userTier = await this.getUserHighestTier(userId);
        if (!userTier || TIER_LEVEL[userTier] < TIER_LEVEL[course.tier]) {
            return { canEnroll: false, reason: `Requires ${course.tier} tier or higher` };
        }
        if (course.isCapped && course.maxEnrollments) {
            if (course._count.enrollments >= course.maxEnrollments) {
                return { canEnroll: false, reason: 'Course enrollment is full' };
            }
        }
        return { canEnroll: true };
    }
};
exports.AccessService = AccessService;
exports.AccessService = AccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccessService);
//# sourceMappingURL=access.service.js.map