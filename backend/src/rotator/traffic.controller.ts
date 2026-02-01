import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RotatorService } from './rotator.service';
import { TenantService } from '../tenant/tenant.service';
import { LeadsService } from '../leads/leads.service';

@Controller('traffic')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class TrafficController {
    constructor(
        private readonly rotatorService: RotatorService,
        private readonly tenantService: TenantService,
        private readonly leadsService: LeadsService,
    ) { }

    // ============================================
    // WHATSAPP GROUPS
    // ============================================

    @Get('groups')
    async getAllGroups() {
        // For now, get GICH tenant groups
        const tenant = await this.tenantService.findBySlug('gich');
        return this.rotatorService.getGroupsForTenant(tenant.id);
    }

    @Post('groups')
    async createGroup(@Body() body: {
        tenantSlug: string;
        name: string;
        inviteLink: string;
        maxClicks?: number;
    }) {
        const tenant = await this.tenantService.findBySlug(body.tenantSlug);
        return this.rotatorService.createGroup(tenant.id, {
            name: body.name,
            inviteLink: body.inviteLink,
            maxClicks: body.maxClicks,
        });
    }

    @Patch('groups/:id')
    async updateGroup(
        @Param('id') id: string,
        @Body() body: {
            name?: string;
            inviteLink?: string;
            maxClicks?: number;
            isActive?: boolean;
        },
    ) {
        return this.rotatorService.updateGroup(id, body);
    }

    // ============================================
    // LEADS
    // ============================================

    @Get('leads')
    async getAllLeads() {
        const tenant = await this.tenantService.findBySlug('gich');
        return this.leadsService.getLeadsForTenant(tenant.id);
    }

    @Get('leads/stats')
    async getLeadStats() {
        const tenant = await this.tenantService.findBySlug('gich');
        return this.leadsService.getLeadStats(tenant.id);
    }

    // ============================================
    // CLICK STATS
    // ============================================

    @Get('clicks/stats')
    async getClickStats() {
        const tenant = await this.tenantService.findBySlug('gich');
        return this.rotatorService.getClickStats(tenant.id);
    }
}
