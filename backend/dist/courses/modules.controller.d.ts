import { CoursesService } from './courses.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
export declare class ModulesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(courseId: string, dto: CreateModuleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        description: string | null;
        orderIndex: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        description: string | null;
        orderIndex: number;
    } | null>;
    update(id: string, dto: UpdateModuleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        description: string | null;
        orderIndex: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    reorder(courseId: string, moduleIds: string[]): Promise<{
        message: string;
    }>;
}
