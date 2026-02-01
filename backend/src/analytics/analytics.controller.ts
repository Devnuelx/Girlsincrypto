import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('dashboard')
    async getDashboardStats() {
        return this.analyticsService.getDashboardStats();
    }

    @Get('revenue')
    async getRevenueStats() {
        return this.analyticsService.getRevenueStats();
    }

    @Get('enrollments/trend')
    async getEnrollmentTrend() {
        return this.analyticsService.getEnrollmentTrend(14);
    }

    @Get('courses/top')
    async getTopCourses() {
        return this.analyticsService.getTopCourses(5);
    }

    @Get('completion')
    async getCompletionStats() {
        return this.analyticsService.getCompletionStats();
    }
}
