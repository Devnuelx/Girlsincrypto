import { Injectable } from '@nestjs/common';
import { DayOfWeek, LessonUnlock } from '@prisma/client';
import { addDays, getDay, isBefore, isAfter } from 'date-fns';

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

const DAY_MAP: Record<DayOfWeek, number> = {
    SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
};

@Injectable()
export class UnlockSchedulerService {
    generateUnlockSchedule(input: ScheduleInput): UnlockEntry[] {
        const { lessons, preferredDays, startDate, minDurationWeeks } = input;

        if (lessons.length === 0) return [];

        const sortedLessons = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);
        const now = new Date();
        const preferredDayNumbers = preferredDays.map(d => DAY_MAP[d]).sort((a, b) => a - b);

        if (preferredDayNumbers.length === 0) {
            return sortedLessons.map((lesson, index) => ({
                lessonId: lesson.id,
                unlockAt: addDays(startDate, index * 7),
                isUnlocked: isBefore(addDays(startDate, index * 7), now),
            }));
        }

        const unlockDates = this.generateUnlockDates(
            startDate,
            sortedLessons.length,
            preferredDayNumbers,
            minDurationWeeks,
        );

        return sortedLessons.map((lesson, index) => ({
            lessonId: lesson.id,
            unlockAt: unlockDates[index],
            isUnlocked: isBefore(unlockDates[index], now) || unlockDates[index].getTime() === now.getTime(),
        }));
    }

    private generateUnlockDates(
        startDate: Date,
        lessonCount: number,
        preferredDayNumbers: number[],
        minDurationWeeks: number,
    ): Date[] {
        const dates: Date[] = [];
        const minEndDate = addDays(startDate, minDurationWeeks * 7);

        let currentDate = new Date(startDate);
        let currentIndex = 0;

        while (dates.length < lessonCount) {
            const dayOfWeek = getDay(currentDate);

            if (preferredDayNumbers.includes(dayOfWeek)) {
                if (dates.length === 0 || isAfter(currentDate, dates[dates.length - 1])) {
                    dates.push(new Date(currentDate));
                }
            }

            currentDate = addDays(currentDate, 1);
            currentIndex++;

            if (currentIndex > 365 * 2) break;
        }

        if (dates.length < lessonCount) {
            while (dates.length < lessonCount) {
                dates.push(addDays(dates[dates.length - 1] || startDate, 7));
            }
        }

        if (dates.length > 1 && isBefore(dates[dates.length - 1], minEndDate)) {
            const daysToSpread = Math.ceil(
                (minEndDate.getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24)
            );
            const interval = Math.floor(daysToSpread / (lessonCount - 1));

            for (let i = 1; i < dates.length; i++) {
                const targetDate = addDays(dates[0], interval * i);
                const nearestPreferredDate = this.findNearestPreferredDay(
                    targetDate,
                    preferredDayNumbers
                );
                dates[i] = nearestPreferredDate;
            }
        }

        return dates;
    }

    private findNearestPreferredDay(date: Date, preferredDayNumbers: number[]): Date {
        const dayOfWeek = getDay(date);

        if (preferredDayNumbers.includes(dayOfWeek)) {
            return date;
        }

        for (let offset = 1; offset <= 7; offset++) {
            const forwardDate = addDays(date, offset);
            if (preferredDayNumbers.includes(getDay(forwardDate))) {
                return forwardDate;
            }

            const backwardDate = addDays(date, -offset);
            if (preferredDayNumbers.includes(getDay(backwardDate))) {
                return backwardDate;
            }
        }

        return date;
    }

    recalculateUnlockSchedule(
        existingUnlocks: LessonUnlock[],
        lessons: LessonInfo[],
        newPreferredDays: DayOfWeek[],
        minDurationWeeks: number,
    ): UnlockEntry[] {
        const now = new Date();
        const alreadyUnlocked = existingUnlocks.filter(u => u.isUnlocked || isBefore(new Date(u.unlockAt), now));
        const alreadyUnlockedIds = new Set(alreadyUnlocked.map(u => u.lessonId));

        const remainingLessons = lessons.filter(l => !alreadyUnlockedIds.has(l.id));

        const result: UnlockEntry[] = alreadyUnlocked.map(u => ({
            lessonId: u.lessonId,
            unlockAt: new Date(u.unlockAt),
            isUnlocked: true,
        }));

        if (remainingLessons.length > 0) {
            const newSchedule = this.generateUnlockSchedule({
                lessons: remainingLessons,
                preferredDays: newPreferredDays,
                startDate: now,
                minDurationWeeks,
            });
            result.push(...newSchedule);
        }

        return result;
    }
}
