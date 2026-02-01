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
export declare class LeadsService {
    private readonly prisma;
    private readonly tenantService;
    private readonly config;
    constructor(prisma: PrismaService, tenantService: TenantService, config: ConfigService);
    captureLead(dto: LeadCaptureDto): Promise<{
        success: boolean;
        leadId: string;
    }>;
    private parseSource;
    private forwardToEmailPlatform;
    private sendToBrevo;
    private sendToActiveCampaign;
    getLeadsForTenant(tenantId: string, options?: {
        skip?: number;
        take?: number;
        source?: LeadSource;
    }): Promise<{
        name: string | null;
        id: string;
        email: string | null;
        createdAt: Date;
        tenantId: string;
        phone: string | null;
        source: import(".prisma/client").$Enums.LeadSource;
    }[]>;
    getLeadStats(tenantId: string): Promise<{
        total: number;
        bySource: Record<string, number>;
    }>;
}
