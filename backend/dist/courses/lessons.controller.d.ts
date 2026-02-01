import { CoursesService } from './courses.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
export declare class LessonsController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(moduleId: string, dto: CreateLessonDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        orderIndex: number;
        contentUrl: string | null;
        contentType: import(".prisma/client").$Enums.ContentType;
        unlockOffset: number;
        isPreviewable: boolean;
        durationMinutes: number | null;
        moduleId: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        orderIndex: number;
        contentUrl: string | null;
        contentType: import(".prisma/client").$Enums.ContentType;
        unlockOffset: number;
        isPreviewable: boolean;
        durationMinutes: number | null;
        moduleId: string;
    } | null>;
    update(id: string, dto: UpdateLessonDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        orderIndex: number;
        contentUrl: string | null;
        contentType: import(".prisma/client").$Enums.ContentType;
        unlockOffset: number;
        isPreviewable: boolean;
        durationMinutes: number | null;
        moduleId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    reorder(moduleId: string, lessonIds: string[]): Promise<{
        message: string;
    }>;
}
