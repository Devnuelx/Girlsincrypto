import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { AccessService } from './access.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role, User } from '@prisma/client';
import { EnrollDto, UpdatePreferencesDto } from './dto/enrollment.dto';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
    constructor(
        private readonly enrollmentsService: EnrollmentsService,
        private readonly accessService: AccessService,
    ) { }

    @Post()
    async enroll(@CurrentUser() user: User, @Body() dto: EnrollDto) {
        return this.enrollmentsService.enroll(user.id, dto);
    }

    @Get('my')
    async getMyEnrollments(@CurrentUser() user: User) {
        return this.enrollmentsService.getUserEnrollments(user.id);
    }

    @Get('my/:courseId')
    async getMyEnrollment(
        @CurrentUser() user: User,
        @Param('courseId') courseId: string,
    ) {
        return this.enrollmentsService.getEnrollment(user.id, courseId);
    }

    @Patch('my/:courseId/preferences')
    async updatePreferences(
        @CurrentUser() user: User,
        @Param('courseId') courseId: string,
        @Body() dto: UpdatePreferencesDto,
    ) {
        return this.enrollmentsService.updatePreferences(user.id, courseId, dto);
    }

    @Get('access/:courseId/:lessonId')
    async checkLessonAccess(
        @CurrentUser() user: User,
        @Param('courseId') courseId: string,
        @Param('lessonId') lessonId: string,
    ) {
        return this.accessService.checkAccess({
            userId: user.id,
            courseId,
            lessonId,
        });
    }

    @Post('progress/:lessonId/complete')
    async markComplete(
        @CurrentUser() user: User,
        @Param('lessonId') lessonId: string,
    ) {
        return this.enrollmentsService.markLessonComplete(user.id, lessonId);
    }

    @Patch('progress/:lessonId/watch')
    async updateWatch(
        @CurrentUser() user: User,
        @Param('lessonId') lessonId: string,
        @Body() dto: { watchTime: number; lastPosition: number },
    ) {
        return this.enrollmentsService.updateWatchProgress(
            user.id,
            lessonId,
            dto.watchTime,
            dto.lastPosition,
        );
    }

    @Patch(':userId/:courseId/override')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async setOverride(
        @Param('userId') userId: string,
        @Param('courseId') courseId: string,
        @Body('override') override: boolean,
    ) {
        return this.enrollmentsService.setAdminOverride(userId, courseId, override);
    }
}
