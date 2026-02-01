import { PrismaService } from '../prisma/prisma.service';
import { Tenant, TenantStatus } from '@prisma/client';
export declare class TenantService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findBySlug(slug: string): Promise<Tenant>;
    findById(id: string): Promise<Tenant | null>;
    create(data: {
        name: string;
        slug: string;
    }): Promise<Tenant>;
    findAll(): Promise<Tenant[]>;
    update(id: string, data: Partial<{
        name: string;
        status: TenantStatus;
    }>): Promise<Tenant>;
}
