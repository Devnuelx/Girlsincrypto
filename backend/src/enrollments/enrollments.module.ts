import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { UnlockSchedulerService } from './unlock-scheduler.service';
import { AccessService } from './access.service';
import { CoursesModule } from '../courses/courses.module';

@Module({
    imports: [CoursesModule],
    controllers: [EnrollmentsController],
    providers: [EnrollmentsService, UnlockSchedulerService, AccessService],
    exports: [EnrollmentsService, AccessService],
})
export class EnrollmentsModule { }
