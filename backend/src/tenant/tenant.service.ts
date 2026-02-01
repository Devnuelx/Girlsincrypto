import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tenant, TenantStatus } from '@prisma/client';

@Injectable()
export class TenantService {
    constructor(private readonly prisma: PrismaService) { }

    async findBySlug(slug: string): Promise<Tenant> {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug },
        });

        if (!tenant || tenant.status !== TenantStatus.ACTIVE) {
            throw new NotFoundException(`Tenant '${slug}' not found or inactive`);
        }

        return tenant;
    }

    async findById(id: string): Promise<Tenant | null> {
        return this.prisma.tenant.findUnique({
            where: { id },
        });
    }

    async create(data: { name: string; slug: string }): Promise<Tenant> {
        return this.prisma.tenant.create({
            data: {
                name: data.name,
                slug: data.slug.toLowerCase(),
                status: TenantStatus.ACTIVE,
            },
        });
    }

    async findAll(): Promise<Tenant[]> {
        return this.prisma.tenant.findMany({
            orderBy: { createdAt: 'asc' },
        });
    }

    async update(id: string, data: Partial<{ name: string; status: TenantStatus }>): Promise<Tenant> {
        return this.prisma.tenant.update({
            where: { id },
            data,
        });
    }
}
