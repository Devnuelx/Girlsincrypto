import { RotatorService } from './rotator.service';
import { TenantService } from '../tenant/tenant.service';
import { LeadsService } from '../leads/leads.service';
export declare class TrafficController {
    private readonly rotatorService;
    private readonly tenantService;
    private readonly leadsService;
    constructor(rotatorService: RotatorService, tenantService: TenantService, leadsService: LeadsService);
    getAllGroups(): Promise<({
        _count: {
            clickLogs: number;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        inviteLink: string;
        clickCount: number;
        maxClicks: number;
    })[]>;
    createGroup(body: {
        tenantSlug: string;
        name: string;
        inviteLink: string;
        maxClicks?: number;
    }): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        inviteLink: string;
        clickCount: number;
        maxClicks: number;
    }>;
    updateGroup(id: string, body: {
        name?: string;
        inviteLink?: string;
        maxClicks?: number;
        isActive?: boolean;
    }): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        inviteLink: string;
        clickCount: number;
        maxClicks: number;
    }>;
    getAllLeads(): Promise<{
        name: string | null;
        id: string;
        email: string | null;
        createdAt: Date;
        tenantId: string;
        phone: string | null;
        source: import(".prisma/client").$Enums.LeadSource;
    }[]>;
    getLeadStats(): Promise<{
        total: number;
        bySource: Record<string, number>;
    }>;
    getClickStats(): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ClickLogGroupByOutputType, "groupId"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
