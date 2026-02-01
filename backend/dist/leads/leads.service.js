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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_service_1 = require("../tenant/tenant.service");
const client_1 = require("@prisma/client");
let LeadsService = class LeadsService {
    constructor(prisma, tenantService, config) {
        this.prisma = prisma;
        this.tenantService = tenantService;
        this.config = config;
    }
    async captureLead(dto) {
        const tenant = await this.tenantService.findBySlug(dto.tenantSlug);
        const source = this.parseSource(dto.source);
        const lead = await this.prisma.lead.create({
            data: {
                tenantId: tenant.id,
                name: dto.name || null,
                email: dto.email || null,
                phone: dto.phone || null,
                source,
            },
        });
        this.forwardToEmailPlatform(lead, tenant.slug);
        return {
            success: true,
            leadId: lead.id,
        };
    }
    parseSource(source) {
        if (!source)
            return client_1.LeadSource.ORGANIC;
        const normalized = source.toLowerCase().replace(/[^a-z_]/g, '_');
        switch (normalized) {
            case 'ads':
                return client_1.LeadSource.ADS;
            case 'landing_page':
                return client_1.LeadSource.LANDING_PAGE;
            case 'cold_email':
                return client_1.LeadSource.COLD_EMAIL;
            default:
                return client_1.LeadSource.ORGANIC;
        }
    }
    async forwardToEmailPlatform(lead, tenantSlug) {
        const brevoKey = this.config.get('BREVO_API_KEY');
        const activeCampaignKey = this.config.get('ACTIVECAMPAIGN_API_KEY');
        const activeCampaignUrl = this.config.get('ACTIVECAMPAIGN_URL');
        if (brevoKey && lead.email) {
            await this.sendToBrevo(lead, brevoKey);
        }
        else if (activeCampaignKey && activeCampaignUrl && lead.email) {
            await this.sendToActiveCampaign(lead, activeCampaignKey, activeCampaignUrl);
        }
    }
    async sendToBrevo(lead, apiKey) {
        try {
            await fetch('https://api.brevo.com/v3/contacts', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'api-key': apiKey,
                },
                body: JSON.stringify({
                    email: lead.email,
                    attributes: {
                        FIRSTNAME: lead.name || '',
                        PHONE: lead.phone || '',
                        SOURCE: lead.source,
                    },
                    updateEnabled: true,
                }),
            });
        }
        catch (error) {
            console.error('Brevo API error:', error);
        }
    }
    async sendToActiveCampaign(lead, apiKey, baseUrl) {
        try {
            await fetch(`${baseUrl}/api/3/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Token': apiKey,
                },
                body: JSON.stringify({
                    contact: {
                        email: lead.email,
                        firstName: lead.name || '',
                        phone: lead.phone || '',
                    },
                }),
            });
        }
        catch (error) {
            console.error('ActiveCampaign API error:', error);
        }
    }
    async getLeadsForTenant(tenantId, options) {
        return this.prisma.lead.findMany({
            where: {
                tenantId,
                ...(options?.source && { source: options.source }),
            },
            orderBy: { createdAt: 'desc' },
            skip: options?.skip,
            take: options?.take || 50,
        });
    }
    async getLeadStats(tenantId) {
        const [total, bySource] = await Promise.all([
            this.prisma.lead.count({ where: { tenantId } }),
            this.prisma.lead.groupBy({
                by: ['source'],
                where: { tenantId },
                _count: { id: true },
            }),
        ]);
        return {
            total,
            bySource: bySource.reduce((acc, item) => {
                acc[item.source] = item._count.id;
                return acc;
            }, {}),
        };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_service_1.TenantService,
        config_1.ConfigService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map