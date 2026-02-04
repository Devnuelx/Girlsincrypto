import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
    seed(): Promise<void>;
    updateFileUrl(id: string, fileUrl: string): Promise<{
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
