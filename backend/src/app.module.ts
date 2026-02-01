import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TenantModule } from './tenant/tenant.module';
import { RotatorModule } from './rotator/rotator.module';
import { LeadsModule } from './leads/leads.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        // Rate limiting: 100 requests per minute default
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 100,
        }]),
        PrismaModule,
        TenantModule,
        AuthModule,
        UsersModule,
        CoursesModule,
        EnrollmentsModule,
        PaymentsModule,
        AnalyticsModule,
        RotatorModule,
        LeadsModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
