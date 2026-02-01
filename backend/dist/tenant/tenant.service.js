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
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TenantService = class TenantService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findBySlug(slug) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug },
        });
        if (!tenant || tenant.status !== client_1.TenantStatus.ACTIVE) {
            throw new common_1.NotFoundException(`Tenant '${slug}' not found or inactive`);
        }
        return tenant;
    }
    async findById(id) {
        return this.prisma.tenant.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return this.prisma.tenant.create({
            data: {
                name: data.name,
                slug: data.slug.toLowerCase(),
                status: client_1.TenantStatus.ACTIVE,
            },
        });
    }
    async findAll() {
        return this.prisma.tenant.findMany({
            orderBy: { createdAt: 'asc' },
        });
    }
    async update(id, data) {
        return this.prisma.tenant.update({
            where: { id },
            data,
        });
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantService);
//# sourceMappingURL=tenant.service.js.map