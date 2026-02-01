import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tier } from '@prisma/client';
import { subDays, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboardStats() {
        const [
            totalUsers,
            activeUsers,
            totalCourses,
            publishedCourses,
            totalEnrollments,
            tierCounts,
            recentEnrollments,
        ] = await Promise.all([
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

        const distribution: Record<Tier, number> = {
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

        const totalRevenue = purchases.reduce(
            (sum, p) => sum + Number(p.amount),
            0
        );

        const revenueByTier: Record<Tier, number> = {
            HEIRESS: 0,
            EMPRESS: 0,
            SOVEREIGN: 0,
        };

        for (const p of purchases) {
            revenueByTier[p.tier] += Number(p.amount);
        }

        // Last 30 days revenue
        const thirtyDaysAgo = subDays(new Date(), 30);
        const recentPurchases = purchases.filter(
            p => new Date(p.purchasedAt) >= thirtyDaysAgo
        );
        const recentRevenue = recentPurchases.reduce(
            (sum, p) => sum + Number(p.amount),
            0
        );

        return {
            total: totalRevenue,
            last30Days: recentRevenue,
            byTier: revenueByTier,
            purchaseCount: purchases.length,
        };
    }

    async getRecentEnrollments(days: number) {
        const since = subDays(new Date(), days);
        return this.prisma.enrollment.count({
            where: {
                createdAt: { gte: since },
            },
        });
    }

    async getEnrollmentTrend(days: number = 14) {
        const trend: Array<{ date: string; count: number }> = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const start = startOfDay(date);
            const end = endOfDay(date);

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

    async getTopCourses(limit: number = 5) {
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
}
