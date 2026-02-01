import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min, Max } from 'class-validator';
import { Tier } from '@prisma/client';

export class CreateCourseDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    thumbnailUrl?: string;

    @IsEnum(Tier)
    @IsOptional()
    tier?: Tier;

    @IsBoolean()
    @IsOptional()
    isCapped?: boolean;

    @IsNumber()
    @IsOptional()
    @Min(1)
    maxEnrollments?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(52)
    minDurationWeeks?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(7)
    maxLessonsPerWeek?: number;

    @IsBoolean()
    @IsOptional()
    allowDayChoice?: boolean;
}

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    thumbnailUrl?: string;

    @IsEnum(Tier)
    @IsOptional()
    tier?: Tier;

    @IsBoolean()
    @IsOptional()
    isCapped?: boolean;

    @IsNumber()
    @IsOptional()
    @Min(1)
    maxEnrollments?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(52)
    minDurationWeeks?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(7)
    maxLessonsPerWeek?: number;

    @IsBoolean()
    @IsOptional()
    allowDayChoice?: boolean;
}
