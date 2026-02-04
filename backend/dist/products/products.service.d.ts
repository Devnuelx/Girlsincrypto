import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ProductType;
        price: number;
        fileUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ProductType;
        price: number;
        fileUrl: string | null;
    } | null>;
    createDefaultProducts(): Promise<void>;
    updateFileUrl(productId: string, fileUrl: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ProductType;
        price: number;
        fileUrl: string | null;
    }>;
}
