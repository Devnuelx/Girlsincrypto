import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            active: number;
        };
        courses: {
            total: number;
            published: number;
        };
        enrollments: {
            total: number;
            recent: number;
        };
        tiers: Record<import(".prisma/client").$Enums.Tier, number>;
    }>;
    getTierDistribution(): Promise<Record<import(".prisma/client").$Enums.Tier, number>>;
    getRevenueStats(): Promise<{
        total: number;
        last30Days: number;
        byTier: Record<import(".prisma/client").$Enums.Tier, number>;
        purchaseCount: number;
    }>;
    getRecentEnrollments(days: number): Promise<number>;
    getEnrollmentTrend(days?: number): Promise<{
        date: string;
        count: number;
    }[]>;
    getTopCourses(limit?: number): Promise<{
        id: string;
        title: string;
        tier: import(".prisma/client").$Enums.Tier;
        enrollments: number;
    }[]>;
    getCompletionStats(): Promise<{
        totalProgress: number;
        completedLessons: number;
        completionRate: number;
    }>;
}
