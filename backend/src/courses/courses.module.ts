import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { ModulesController } from './modules.controller';
import { LessonsController } from './lessons.controller';

@Module({
    controllers: [CoursesController, ModulesController, LessonsController],
    providers: [CoursesService],
    exports: [CoursesService],
})
export class CoursesModule { }
