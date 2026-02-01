import { DayOfWeek } from '@prisma/client';
export declare class EnrollDto {
    courseId: string;
    preferredDays?: DayOfWeek[];
    startDate?: string;
}
export declare class UpdatePreferencesDto {
    preferredDays: DayOfWeek[];
}
