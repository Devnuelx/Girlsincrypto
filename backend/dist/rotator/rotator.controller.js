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
exports.RotatorController = void 0;
const common_1 = require("@nestjs/common");
const rotator_service_1 = require("./rotator.service");
const throttler_1 = require("@nestjs/throttler");
let RotatorController = class RotatorController {
    constructor(rotatorService) {
        this.rotatorService = rotatorService;
    }
    async join(tenantSlug, req, res) {
        const ip = this.getClientIp(req);
        const userAgent = req.headers['user-agent'] || undefined;
        try {
            const result = await this.rotatorService.getNextGroup(tenantSlug, ip, userAgent);
            return res.redirect(common_1.HttpStatus.FOUND, result.redirectUrl);
        }
        catch (error) {
            console.error(`Rotator error for ${tenantSlug}:`, error);
            return res.redirect(common_1.HttpStatus.FOUND, '/waiting-room?status=error');
        }
    }
    getClientIp(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
            return ips.trim();
        }
        return req.ip || req.socket?.remoteAddress || 'unknown';
    }
};
exports.RotatorController = RotatorController;
__decorate([
    (0, common_1.Get)(':tenantSlug/join'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('tenantSlug')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RotatorController.prototype, "join", null);
exports.RotatorController = RotatorController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [rotator_service_1.RotatorService])
], RotatorController);
//# sourceMappingURL=rotator.controller.js.map