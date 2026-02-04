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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotatorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_service_1 = require("../tenant/tenant.service");
let RotatorService = class RotatorService {
    constructor(prisma, tenantService) {
        this.prisma = prisma;
        this.tenantService = tenantService;
    }
    async getNextGroup(tenantSlug, ip, userAgent) {
        const tenant = await this.tenantService.findBySlug(tenantSlug);
        const groups = await this.prisma.whatsappGroup.findMany({
            where: {
                tenantId: tenant.id,
                isActive: true,
            },
            orderBy: { createdAt: 'asc' }
        });
        const availableGroup = groups.find(g => g.clickCount < g.maxClicks);
        if (!availableGroup) {
            return {
                success: false,
                redirectUrl: '/waiting-room?status=full',
            };
        }
        await this.prisma.$transaction([
            this.prisma.whatsappGroup.update({
                where: { id: availableGroup.id },
                data: { clickCount: { increment: 1 } },
            }),
            this.prisma.clickLog.create({
                data: {
                    tenantId: tenant.id,
                    groupId: availableGroup.id,
                    ip: ip || null,
                    userAgent: userAgent || null,
                },
            }),
        ]);
        return {
            success: true,
            redirectUrl: availableGroup.inviteLink,
            groupName: availableGroup.name,
        };
    }
    async createGroup(tenantId, data) {
        return this.prisma.whatsappGroup.create({
            data: {
                tenantId,
                name: data.name,
                inviteLink: data.inviteLink,
                maxClicks: data.maxClicks || 900,
            },
        });
    }
    async updateGroup(groupId, data) {
        return this.prisma.whatsappGroup.update({
            where: { id: groupId },
            data,
        });
    }
    async getGroupsForTenant(tenantId) {
        return this.prisma.whatsappGroup.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'asc' },
            include: {
                _count: { select: { clickLogs: true } },
            },
        });
    }
    async getClickStats(tenantId, days = 7) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        return this.prisma.clickLog.groupBy({
            by: ['groupId'],
            where: {
                tenantId,
                createdAt: { gte: since },
            },
            _count: { id: true },
        });
    }
};
exports.RotatorService = RotatorService;
exports.RotatorService = RotatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_service_1.TenantService])
], RotatorService);
//# sourceMappingURL=rotator.service.js.map