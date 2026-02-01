import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { WhatsappGroup } from '@prisma/client';

export interface RotatorResult {
    success: boolean;
    redirectUrl: string;
    groupName?: string;
}

@Injectable()
export class RotatorService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tenantService: TenantService,
    ) { }

    /**
     * Get the next available WhatsApp group for a tenant
     * Uses SEQUENTIAL FILLING: fills oldest group first before moving to next
     */
    async getNextGroup(
        tenantSlug: string,
        ip?: string,
        userAgent?: string,
    ): Promise<RotatorResult> {
        // 1. Resolve tenant
        const tenant = await this.tenantService.findBySlug(tenantSlug);

        // 2. Find first available group using raw SQL (sequential order by createdAt)
        // WHERE isActive = true AND clickCount < maxClicks ORDER BY createdAt ASC
        const groups = await this.prisma.$queryRaw<WhatsappGroup[]>`
      SELECT * FROM whatsapp_groups 
      WHERE "tenantId" = ${tenant.id}
        AND "isActive" = true 
        AND "clickCount" < "maxClicks"
      ORDER BY "createdAt" ASC
      LIMIT 1
    `;

        const availableGroup = groups[0];

        // 3. No group available → waiting room
        if (!availableGroup) {
            return {
                success: false,
                redirectUrl: '/waiting-room?status=full',
            };
        }

        // 4. Atomic transaction: increment click + log
        await this.prisma.$transaction([
            // Increment click count
            this.prisma.whatsappGroup.update({
                where: { id: availableGroup.id },
                data: { clickCount: { increment: 1 } },
            }),
            // Log the click
            this.prisma.clickLog.create({
                data: {
                    tenantId: tenant.id,
                    groupId: availableGroup.id,
                    ip: ip || null,
                    userAgent: userAgent || null,
                },
            }),
        ]);

        // 5. Return redirect URL
        return {
            success: true,
            redirectUrl: availableGroup.inviteLink,
            groupName: availableGroup.name,
        };
    }

    // Admin methods for managing groups
    async createGroup(tenantId: string, data: {
        name: string;
        inviteLink: string;
        maxClicks?: number;
    }) {
        return this.prisma.whatsappGroup.create({
            data: {
                tenantId,
                name: data.name,
                inviteLink: data.inviteLink,
                maxClicks: data.maxClicks || 900,
            },
        });
    }

    async updateGroup(groupId: string, data: {
        name?: string;
        inviteLink?: string;
        maxClicks?: number;
        isActive?: boolean;
    }) {
        return this.prisma.whatsappGroup.update({
            where: { id: groupId },
            data,
        });
    }

    async getGroupsForTenant(tenantId: string) {
        return this.prisma.whatsappGroup.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'asc' },
            include: {
                _count: { select: { clickLogs: true } },
            },
        });
    }

    async getClickStats(tenantId: string, days: number = 7) {
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
}
