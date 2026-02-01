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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, activeUsers, totalCourses, publishedCourses, totalEnrollments, tierCounts, recentEnrollments,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.course.count(),
            this.prisma.course.count({ where: { isPublished: true } }),
            this.prisma.enrollment.count(),
            this.getTierDistribution(),
            this.getRecentEnrollments(7),
        ]);
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
            },
            courses: {
                total: totalCourses,
                published: publishedCourses,
            },
            enrollments: {
                total: totalEnrollments,
                recent: recentEnrollments,
            },
            tiers: tierCounts,
        };
    }
    async getTierDistribution() {
        const purchases = await this.prisma.tierPurchase.groupBy({
            by: ['tier'],
            _count: { tier: true },
        });
        const distribution = {
            HEIRESS: 0,
            EMPRESS: 0,
            SOVEREIGN: 0,
        };
        for (const p of purchases) {
            distribution[p.tier] = p._count.tier;
        }
        return distribution;
    }
    async getRevenueStats() {
        const purchases = await this.prisma.tierPurchase.findMany({
            select: {
                tier: true,
                amount: true,
                purchasedAt: true,
            },
        });
        const totalRevenue = purchases.reduce((sum, p) => sum + Number(p.amount), 0);
        const revenueByTier = {
            HEIRESS: 0,
            EMPRESS: 0,
            SOVEREIGN: 0,
        };
        for (const p of purchases) {
            revenueByTier[p.tier] += Number(p.amount);
        }
        const thirtyDaysAgo = (0, date_fns_1.subDays)(new Date(), 30);
        const recentPurchases = purchases.filter(p => new Date(p.purchasedAt) >= thirtyDaysAgo);
        const recentRevenue = recentPurchases.reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            total: totalRevenue,
            last30Days: recentRevenue,
            byTier: revenueByTier,
            purchaseCount: purchases.length,
        };
    }
    async getRecentEnrollments(days) {
        const since = (0, date_fns_1.subDays)(new Date(), days);
        return this.prisma.enrollment.count({
            where: {
                createdAt: { gte: since },
            },
        });
    }
    async getEnrollmentTrend(days = 14) {
        const trend = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = (0, date_fns_1.subDays)(new Date(), i);
            const start = (0, date_fns_1.startOfDay)(date);
            const end = (0, date_fns_1.endOfDay)(date);
            const count = await this.prisma.enrollment.count({
                where: {
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
            });
            trend.push({
                date: start.toISOString().split('T')[0],
                count,
            });
        }
        return trend;
    }
    async getTopCourses(limit = 5) {
        const courses = await this.prisma.course.findMany({
            where: { isPublished: true },
            select: {
                id: true,
                title: true,
                tier: true,
                _count: {
                    select: { enrollments: true },
                },
            },
            orderBy: {
                enrollments: { _count: 'desc' },
            },
            take: limit,
        });
        return courses.map(c => ({
            id: c.id,
            title: c.title,
            tier: c.tier,
            enrollments: c._count.enrollments,
        }));
    }
    async getCompletionStats() {
        const [totalProgress, completedLessons] = await Promise.all([
            this.prisma.progress.count(),
            this.prisma.progress.count({ where: { isCompleted: true } }),
        ]);
        return {
            totalProgress,
            completedLessons,
            completionRate: totalProgress > 0
                ? Math.round((completedLessons / totalProgress) * 100)
                : 0,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map