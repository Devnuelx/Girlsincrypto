import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Post('seed')
    seed() {
        return this.productsService.createDefaultProducts();
    }

    @Patch(':id/file-url')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    updateFileUrl(
        @Param('id') id: string,
        @Body('fileUrl') fileUrl: string,
    ) {
        return this.productsService.updateFileUrl(id, fileUrl);
    }
}
