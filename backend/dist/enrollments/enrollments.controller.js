"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentsController = void 0;
const common_1 = require("@nestjs/common");
const enrollments_service_1 = require("./enrollments.service");
const access_service_1 = require("./access.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const enrollment_dto_1 = require("./dto/enrollment.dto");
let EnrollmentsController = class EnrollmentsController {
    constructor(enrollmentsService, accessService) {
        this.enrollmentsService = enrollmentsService;
        this.accessService = accessService;
    }
    async enroll(user, dto) {
        return this.enrollmentsService.enroll(user.id, dto);
    }
    async getMyEnrollments(user) {
        return this.enrollmentsService.getUserEnrollments(user.id);
    }
    async getMyEnrollment(user, courseId) {
        return this.enrollmentsService.getEnrollment(user.id, courseId);
    }
    async updatePreferences(user, courseId, dto) {
        return this.enrollmentsService.updatePreferences(user.id, courseId, dto);
    }
    async checkLessonAccess(user, courseId, lessonId) {
        return this.accessService.checkAccess({
            userId: user.id,
            courseId,
            lessonId,
        });
    }
    async markComplete(user, lessonId) {
        return this.enrollmentsService.markLessonComplete(user.id, lessonId);
    }
    async updateWatch(user, lessonId, dto) {
        return this.enrollmentsService.updateWatchProgress(user.id, lessonId, dto.watchTime, dto.lastPosition);
    }
    async setOverride(userId, courseId, override) {
        return this.enrollmentsService.setAdminOverride(userId, courseId, override);
    }
};
exports.EnrollmentsController = EnrollmentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, enrollment_dto_1.EnrollDto]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "enroll", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "getMyEnrollments", null);
__decorate([
    (0, common_1.Get)('my/:courseId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "getMyEnrollment", null);
__decorate([
    (0, common_1.Patch)('my/:courseId/preferences'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, enrollment_dto_1.UpdatePreferencesDto]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Get)('access/:courseId/:lessonId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "checkLessonAccess", null);
__decorate([
    (0, common_1.Post)('progress/:lessonId/complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "markComplete", null);
__decorate([
    (0, common_1.Patch)('progress/:lessonId/watch'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('lessonId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "updateWatch", null);
__decorate([
    (0, common_1.Patch)(':userId/:courseId/override'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Body)('override')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "setOverride", null);
exports.EnrollmentsController = EnrollmentsController = __decorate([
    (0, common_1.Controller)('enrollments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [enrollments_service_1.EnrollmentsService,
        access_service_1.AccessService])
], EnrollmentsController);
//# sourceMappingURL=enrollments.controller.js.map