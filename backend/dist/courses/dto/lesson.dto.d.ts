import { ContentType } from '@prisma/client';
export declare class CreateLessonDto {
    title: string;
    description?: string;
    contentUrl?: string;
    contentType?: ContentType;
    orderIndex?: number;
    unlockOffset?: number;
    isPreviewable?: boolean;
    durationMinutes?: number;
}
export declare class UpdateLessonDto {
    title?: string;
    description?: string;
    contentUrl?: string;
    contentType?: ContentType;
    orderIndex?: number;
    unlockOffset?: number;
    isPreviewable?: boolean;
    durationMinutes?: number;
}
