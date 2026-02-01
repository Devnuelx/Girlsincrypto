import { IsString, IsArray, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { DayOfWeek } from '@prisma/client';

export class EnrollDto {
    @IsString()
    courseId: string;

    @IsArray()
    @IsEnum(DayOfWeek, { each: true })
    @IsOptional()
    preferredDays?: DayOfWeek[];

    @IsDateString()
    @IsOptional()
    startDate?: string;
}

export class UpdatePreferencesDto {
    @IsArray()
    @IsEnum(DayOfWeek, { each: true })
    preferredDays: DayOfWeek[];
}
