import {
    Controller,
    Get,
    Post,
    Param,
    UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, Tier } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Get('tiers')
    async getTierPricing() {
        return this.paymentsService.getTierPricing();
    }

    @Get('my-tiers')
    @UseGuards(JwtAuthGuard)
    async getMyTiers(@CurrentUser() user: User) {
        return this.paymentsService.getUserTiers(user.id);
    }

    @Post('checkout/:tier')
    @UseGuards(JwtAuthGuard)
    async createTierCheckout(
        @CurrentUser() user: User,
        @Param('tier') tier: string,
    ) {
        // Validate tier
        const validTiers: Tier[] = ['HEIRESS', 'EMPRESS', 'SOVEREIGN'];
        if (!validTiers.includes(tier.toUpperCase() as Tier)) {
            throw new Error('Invalid tier');
        }
        return this.paymentsService.createTierCheckout(user.id, tier.toUpperCase() as Tier);
    }
}
