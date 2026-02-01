"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnlockSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const DAY_MAP = {
    SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
};
let UnlockSchedulerService = class UnlockSchedulerService {
    generateUnlockSchedule(input) {
        const { lessons, preferredDays, startDate, minDurationWeeks } = input;
        if (lessons.length === 0)
            return [];
        const sortedLessons = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);
        const now = new Date();
        const preferredDayNumbers = preferredDays.map(d => DAY_MAP[d]).sort((a, b) => a - b);
        if (preferredDayNumbers.length === 0) {
            return sortedLessons.map((lesson, index) => ({
                lessonId: lesson.id,
                unlockAt: (0, date_fns_1.addDays)(startDate, index * 7),
                isUnlocked: (0, date_fns_1.isBefore)((0, date_fns_1.addDays)(startDate, index * 7), now),
            }));
        }
        const unlockDates = this.generateUnlockDates(startDate, sortedLessons.length, preferredDayNumbers, minDurationWeeks);
        return sortedLessons.map((lesson, index) => ({
            lessonId: lesson.id,
            unlockAt: unlockDates[index],
            isUnlocked: (0, date_fns_1.isBefore)(unlockDates[index], now) || unlockDates[index].getTime() === now.getTime(),
        }));
    }
    generateUnlockDates(startDate, lessonCount, preferredDayNumbers, minDurationWeeks) {
        const dates = [];
        const minEndDate = (0, date_fns_1.addDays)(startDate, minDurationWeeks * 7);
        let currentDate = new Date(startDate);
        let currentIndex = 0;
        while (dates.length < lessonCount) {
            const dayOfWeek = (0, date_fns_1.getDay)(currentDate);
            if (preferredDayNumbers.includes(dayOfWeek)) {
                if (dates.length === 0 || (0, date_fns_1.isAfter)(currentDate, dates[dates.length - 1])) {
                    dates.push(new Date(currentDate));
                }
            }
            currentDate = (0, date_fns_1.addDays)(currentDate, 1);
            currentIndex++;
            if (currentIndex > 365 * 2)
                break;
        }
        if (dates.length < lessonCount) {
            while (dates.length < lessonCount) {
                dates.push((0, date_fns_1.addDays)(dates[dates.length - 1] || startDate, 7));
            }
        }
        if (dates.length > 1 && (0, date_fns_1.isBefore)(dates[dates.length - 1], minEndDate)) {
            const daysToSpread = Math.ceil((minEndDate.getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24));
            const interval = Math.floor(daysToSpread / (lessonCount - 1));
            for (let i = 1; i < dates.length; i++) {
                const targetDate = (0, date_fns_1.addDays)(dates[0], interval * i);
                const nearestPreferredDate = this.findNearestPreferredDay(targetDate, preferredDayNumbers);
                dates[i] = nearestPreferredDate;
            }
        }
        return dates;
    }
    findNearestPreferredDay(date, preferredDayNumbers) {
        const dayOfWeek = (0, date_fns_1.getDay)(date);
        if (preferredDayNumbers.includes(dayOfWeek)) {
            return date;
        }
        for (let offset = 1; offset <= 7; offset++) {
            const forwardDate = (0, date_fns_1.addDays)(date, offset);
            if (preferredDayNumbers.includes((0, date_fns_1.getDay)(forwardDate))) {
                return forwardDate;
            }
            const backwardDate = (0, date_fns_1.addDays)(date, -offset);
            if (preferredDayNumbers.includes((0, date_fns_1.getDay)(backwardDate))) {
                return backwardDate;
            }
        }
        return date;
    }
    recalculateUnlockSchedule(existingUnlocks, lessons, newPreferredDays, minDurationWeeks) {
        const now = new Date();
        const alreadyUnlocked = existingUnlocks.filter(u => u.isUnlocked || (0, date_fns_1.isBefore)(new Date(u.unlockAt), now));
        const alreadyUnlockedIds = new Set(alreadyUnlocked.map(u => u.lessonId));
        const remainingLessons = lessons.filter(l => !alreadyUnlockedIds.has(l.id));
        const result = alreadyUnlocked.map(u => ({
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
};
exports.UnlockSchedulerService = UnlockSchedulerService;
exports.UnlockSchedulerService = UnlockSchedulerService = __decorate([
    (0, common_1.Injectable)()
], UnlockSchedulerService);
//# sourceMappingURL=unlock-scheduler.service.js.map