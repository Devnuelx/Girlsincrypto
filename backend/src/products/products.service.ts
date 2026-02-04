import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductType } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.product.findMany({
            where: { isActive: true },
        });
    }

    async findOne(id: string) {
        return this.prisma.product.findUnique({
            where: { id },
        });
    }

    async createDefaultProducts() {
        // Seed default products if they don't exist
        const count = await this.prisma.product.count();
        if (count > 0) return;

        const products = [
            {
                title: "Crypto Beginners Guide",
                price: 99.00,
                type: ProductType.EBOOK,
                description: "Master the fundamentals of cryptocurrency.",
                fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view", // Replace with actual e-book link
            },
            {
                title: "Crypto Investing Starterpack",
                price: 99.00,
                type: ProductType.EBOOK,
                description: "Your complete guide to starting your crypto investment journey.",
                fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view", // Replace with actual e-book link
            },
            {
                title: "The Memecoin Edge",
                price: 99.00,
                type: ProductType.EBOOK,
                description: "Navigate the world of memecoins.",
                fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view", // Replace with actual e-book link
            },
            {
                title: "Understanding Web3",
                price: 99.00,
                type: ProductType.EBOOK,
                description: "Comprehensive guide to blockchain technology.",
                fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view", // Replace with actual e-book link
            },
            {
                title: "One Week Onboarding",
                price: 599.00,
                type: ProductType.MENTORSHIP,
                description: "Personalized 1-on-1 guidance.",
                // No fileUrl needed - Calendly link is sent automatically
            }
        ];

        for (const p of products) {
            await this.prisma.product.create({ data: p });
        }
    }

    /**
     * Update a product's file URL (for e-books)
     */
    async updateFileUrl(productId: string, fileUrl: string) {
        return this.prisma.product.update({
            where: { id: productId },
            data: { fileUrl },
        });
    }
}
