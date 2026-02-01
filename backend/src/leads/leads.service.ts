import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { LeadSource } from '@prisma/client';

export interface LeadCaptureDto {
    tenantSlug: string;
    name?: string;
    email?: string;
    phone?: string;
    source?: string;
}

@Injectable()
export class LeadsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tenantService: TenantService,
        private readonly config: ConfigService,
    ) { }

    async captureLead(dto: LeadCaptureDto) {
        // 1. Resolve tenant
        const tenant = await this.tenantService.findBySlug(dto.tenantSlug);

        // 2. Parse source
        const source = this.parseSource(dto.source);

        // 3. Store lead in DB
        const lead = await this.prisma.lead.create({
            data: {
                tenantId: tenant.id,
                name: dto.name || null,
                email: dto.email || null,
                phone: dto.phone || null,
                source,
            },
        });

        // 4. Forward to email platform (async, don't block)
        this.forwardToEmailPlatform(lead, tenant.slug);

        return {
            success: true,
            leadId: lead.id,
        };
    }

    private parseSource(source?: string): LeadSource {
        if (!source) return LeadSource.ORGANIC;

        const normalized = source.toLowerCase().replace(/[^a-z_]/g, '_');

        switch (normalized) {
            case 'ads':
                return LeadSource.ADS;
            case 'landing_page':
                return LeadSource.LANDING_PAGE;
            case 'cold_email':
                return LeadSource.COLD_EMAIL;
            default:
                return LeadSource.ORGANIC;
        }
    }

    private async forwardToEmailPlatform(lead: any, tenantSlug: string): Promise<void> {
        // Choose platform based on config
        const brevoKey = this.config.get<string>('BREVO_API_KEY');
        const activeCampaignKey = this.config.get<string>('ACTIVECAMPAIGN_API_KEY');
        const activeCampaignUrl = this.config.get<string>('ACTIVECAMPAIGN_URL');

        if (brevoKey && lead.email) {
            await this.sendToBrevo(lead, brevoKey);
        } else if (activeCampaignKey && activeCampaignUrl && lead.email) {
            await this.sendToActiveCampaign(lead, activeCampaignKey, activeCampaignUrl);
        }
    }

    private async sendToBrevo(lead: any, apiKey: string): Promise<void> {
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
        } catch (error) {
            console.error('Brevo API error:', error);
        }
    }

    private async sendToActiveCampaign(
        lead: any,
        apiKey: string,
        baseUrl: string,
    ): Promise<void> {
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
        } catch (error) {
            console.error('ActiveCampaign API error:', error);
        }
    }

    async getLeadsForTenant(tenantId: string, options?: {
        skip?: number;
        take?: number;
        source?: LeadSource;
    }) {
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

    async getLeadStats(tenantId: string) {
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
            }, {} as Record<string, number>),
        };
    }
}
