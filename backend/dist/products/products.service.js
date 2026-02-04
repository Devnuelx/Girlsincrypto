"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.product.findMany({
            where: { isActive: true },
        });
    }
    async findOne(id) {
        return this.prisma.product.findUnique({
            where: { id },
        });
    }
    async createDefaultProducts() {
        const count = await this.prisma.product.count();
        if (count > 0)
            return;
        const products = [
            {
                title: "Crypto Beginners Guide",
                price: 99.00,
                type: client_1.ProductType.EBOOK,
                description: "Master the fundamentals of cryptocurrency.",
                fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
            },
            {
                title: "Crypto Investing Starterpack",
                price: 99.00,
                type: client_1.ProductType.EBOOK,
                description: "Your complete guide to starting your crypto investment journey.",
                fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
            },
            {
                title: "The Memecoin Edge",
                price: 99.00,
                type: client_1.ProductType.EBOOK,
                description: "Navigate the world of memecoins.",
                fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
            },
            {
                title: "Understanding Web3",
                price: 99.00,
                type: client_1.ProductType.EBOOK,
                description: "Comprehensive guide to blockchain technology.",
                fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
            },
            {
                title: "One Week Onboarding",
                price: 599.00,
                type: client_1.ProductType.MENTORSHIP,
                description: "Personalized 1-on-1 guidance.",
            }
        ];
        for (const p of products) {
            await this.prisma.product.create({ data: p });
        }
    }
    async updateFileUrl(productId, fileUrl) {
        return this.prisma.product.update({
            where: { id: productId },
            data: { fileUrl },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map