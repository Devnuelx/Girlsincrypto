"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentsModule = void 0;
const common_1 = require("@nestjs/common");
const enrollments_service_1 = require("./enrollments.service");
const enrollments_controller_1 = require("./enrollments.controller");
const unlock_scheduler_service_1 = require("./unlock-scheduler.service");
const access_service_1 = require("./access.service");
const courses_module_1 = require("../courses/courses.module");
let EnrollmentsModule = class EnrollmentsModule {
};
exports.EnrollmentsModule = EnrollmentsModule;
exports.EnrollmentsModule = EnrollmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [courses_module_1.CoursesModule],
        controllers: [enrollments_controller_1.EnrollmentsController],
        providers: [enrollments_service_1.EnrollmentsService, unlock_scheduler_service_1.UnlockSchedulerService, access_service_1.AccessService],
        exports: [enrollments_service_1.EnrollmentsService, access_service_1.AccessService],
    })
], EnrollmentsModule);
//# sourceMappingURL=enrollments.module.js.map