import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
export interface RotatorResult {
    success: boolean;
    redirectUrl: string;
    groupName?: string;
}
export declare class RotatorService {
    private readonly prisma;
    private readonly tenantService;
    constructor(prisma: PrismaService, tenantService: TenantService);
    getNextGroup(tenantSlug: string, ip?: string, userAgent?: string): Promise<RotatorResult>;
    createGroup(tenantId: string, data: {
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
    updateGroup(groupId: string, data: {
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
    getGroupsForTenant(tenantId: string): Promise<({
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
    getClickStats(tenantId: string, days?: number): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ClickLogGroupByOutputType, "groupId"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
