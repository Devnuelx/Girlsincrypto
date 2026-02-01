import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min } from 'class-validator';
import { ContentType } from '@prisma/client';

export class CreateLessonDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    contentUrl?: string;

    @IsEnum(ContentType)
    @IsOptional()
    contentType?: ContentType;

    @IsNumber()
    @IsOptional()
    @Min(0)
    orderIndex?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    unlockOffset?: number;

    @IsBoolean()
    @IsOptional()
    isPreviewable?: boolean;

    @IsNumber()
    @IsOptional()
    @Min(0)
    durationMinutes?: number;
}

export class UpdateLessonDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    contentUrl?: string;

    @IsEnum(ContentType)
    @IsOptional()
    contentType?: ContentType;

    @IsNumber()
    @IsOptional()
    @Min(0)
    orderIndex?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    unlockOffset?: number;

    @IsBoolean()
    @IsOptional()
    isPreviewable?: boolean;

    @IsNumber()
    @IsOptional()
    @Min(0)
    durationMinutes?: number;
}
