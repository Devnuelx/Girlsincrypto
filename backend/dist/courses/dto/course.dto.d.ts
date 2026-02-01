import { Tier } from '@prisma/client';
export declare class CreateCourseDto {
    title: string;
    description?: string;
    thumbnailUrl?: string;
    tier?: Tier;
    isCapped?: boolean;
    maxEnrollments?: number;
    minDurationWeeks?: number;
    maxLessonsPerWeek?: number;
    allowDayChoice?: boolean;
}
export declare class UpdateCourseDto {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    tier?: Tier;
    isCapped?: boolean;
    maxEnrollments?: number;
    minDurationWeeks?: number;
    maxLessonsPerWeek?: number;
    allowDayChoice?: boolean;
}
