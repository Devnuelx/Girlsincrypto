import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
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
    getRevenueStats(): Promise<{
        total: number;
        last30Days: number;
        byTier: Record<import(".prisma/client").$Enums.Tier, number>;
        purchaseCount: number;
    }>;
    getEnrollmentTrend(): Promise<{
        date: string;
        count: number;
    }[]>;
    getTopCourses(): Promise<{
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
