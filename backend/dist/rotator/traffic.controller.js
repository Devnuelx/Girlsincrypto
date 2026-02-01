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
exports.TrafficController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const rotator_service_1 = require("./rotator.service");
const tenant_service_1 = require("../tenant/tenant.service");
const leads_service_1 = require("../leads/leads.service");
let TrafficController = class TrafficController {
    constructor(rotatorService, tenantService, leadsService) {
        this.rotatorService = rotatorService;
        this.tenantService = tenantService;
        this.leadsService = leadsService;
    }
    async getAllGroups() {
        const tenant = await this.tenantService.findBySlug('gich');
        return this.rotatorService.getGroupsForTenant(tenant.id);
    }
    async createGroup(body) {
        const tenant = await this.tenantService.findBySlug(body.tenantSlug);
        return this.rotatorService.createGroup(tenant.id, {
            name: body.name,
            inviteLink: body.inviteLink,
            maxClicks: body.maxClicks,
        });
    }
    async updateGroup(id, body) {
        return this.rotatorService.updateGroup(id, body);
    }
    async getAllLeads() {
        const tenant = await this.tenantService.findBySlug('gich');
        return this.leadsService.getLeadsForTenant(tenant.id);
    }
    async getLeadStats() {
        const tenant = await this.tenantService.findBySlug('gich');
        return this.leadsService.getLeadStats(tenant.id);
    }
    async getClickStats() {
        const tenant = await this.tenantService.findBySlug('gich');
        return this.rotatorService.getClickStats(tenant.id);
    }
};
exports.TrafficController = TrafficController;
__decorate([
    (0, common_1.Get)('groups'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficController.prototype, "getAllGroups", null);
__decorate([
    (0, common_1.Post)('groups'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrafficController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Patch)('groups/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrafficController.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Get)('leads'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficController.prototype, "getAllLeads", null);
__decorate([
    (0, common_1.Get)('leads/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficController.prototype, "getLeadStats", null);
__decorate([
    (0, common_1.Get)('clicks/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficController.prototype, "getClickStats", null);
exports.TrafficController = TrafficController = __decorate([
    (0, common_1.Controller)('traffic'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:paramtypes", [rotator_service_1.RotatorService,
        tenant_service_1.TenantService,
        leads_service_1.LeadsService])
], TrafficController);
//# sourceMappingURL=traffic.controller.js.map