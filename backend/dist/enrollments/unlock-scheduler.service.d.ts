import { DayOfWeek, LessonUnlock } from '@prisma/client';
interface LessonInfo {
    id: string;
    orderIndex: number;
}
interface ScheduleInput {
    lessons: LessonInfo[];
    preferredDays: DayOfWeek[];
    startDate: Date;
    minDurationWeeks: number;
    timezone?: string;
}
interface UnlockEntry {
    lessonId: string;
    unlockAt: Date;
    isUnlocked: boolean;
}
export declare class UnlockSchedulerService {
    generateUnlockSchedule(input: ScheduleInput): UnlockEntry[];
    private generateUnlockDates;
    private findNearestPreferredDay;
    recalculateUnlockSchedule(existingUnlocks: LessonUnlock[], lessons: LessonInfo[], newPreferredDays: DayOfWeek[], minDurationWeeks: number): UnlockEntry[];
}
export {};
