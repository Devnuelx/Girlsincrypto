import { PrismaService } from '../prisma/prisma.service';
import { Course, Module, Lesson } from '@prisma/client';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCourse(dto: CreateCourseDto): Promise<Course>;
    findAllCourses(params?: {
        published?: boolean;
        skip?: number;
        take?: number;
    }): Promise<Course[]>;
    findCourseById(id: string): Promise<Course | null>;
    findCourseBySlug(slug: string): Promise<Course | null>;
    updateCourse(id: string, dto: UpdateCourseDto): Promise<Course>;
    deleteCourse(id: string): Promise<void>;
    publishCourse(id: string, publish: boolean): Promise<Course>;
    createModule(courseId: string, dto: CreateModuleDto): Promise<Module>;
    findModuleById(id: string): Promise<Module | null>;
    updateModule(id: string, dto: UpdateModuleDto): Promise<Module>;
    deleteModule(id: string): Promise<void>;
    reorderModules(courseId: string, moduleIds: string[]): Promise<void>;
    createLesson(moduleId: string, dto: CreateLessonDto): Promise<Lesson>;
    findLessonById(id: string): Promise<Lesson | null>;
    updateLesson(id: string, dto: UpdateLessonDto): Promise<Lesson>;
    deleteLesson(id: string): Promise<void>;
    reorderLessons(moduleId: string, lessonIds: string[]): Promise<void>;
    private generateSlug;
    getTotalLessonsForCourse(courseId: string): Promise<number>;
    getAllLessonsForCourse(courseId: string): Promise<Lesson[]>;
}
