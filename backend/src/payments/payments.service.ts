import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Tier } from '@prisma/client';
import Stripe from 'stripe';

// Tier pricing configuration (in cents for Stripe)
const TIER_PRICES: Record<Tier, { amount: number; name: string; description: string }> = {
    HEIRESS: {
        amount: 9900, // $99
        name: 'Heiress Tier',
        description: 'Entry level access to foundational crypto courses',
    },
    EMPRESS: {
        amount: 19900, // $199
        name: 'Empress Tier',
        description: 'Mid-tier access including Heiress + advanced courses',
    },
    SOVEREIGN: {
        amount: 49900, // $499
        name: 'Sovereign Tier',
        description: 'Full access to ALL courses on the platform',
    },
};

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2023-10-16',
        });
    }

    async createTierCheckout(userId: string, tier: Tier): Promise<{ url: string }> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Check if already purchased this tier or higher
        const existingPurchase = await this.prisma.tierPurchase.findFirst({
            where: { userId, tier },
        });
        if (existingPurchase) {
            throw new BadRequestException(`You already own the ${tier} tier`);
        }

        const tierInfo = TIER_PRICES[tier];
        const customerId = await this.getOrCreateCustomer(userId, user.email);

        const session = await this.stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: tierInfo.name,
                            description: tierInfo.description,
                        },
                        unit_amount: tierInfo.amount,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${this.config.get('FRONTEND_URL')}/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
            cancel_url: `${this.config.get('FRONTEND_URL')}/pricing`,
            metadata: {
                userId,
                tier,
                type: 'tier_purchase',
            },
        });

        return { url: session.url! };
    }

    async getUserTiers(userId: string): Promise<{
        purchasedTiers: Tier[];
        highestTier: Tier | null;
        accessibleTiers: Tier[];
    }> {
        const purchases = await this.prisma.tierPurchase.findMany({
            where: { userId },
            select: { tier: true },
        });

        const purchasedTiers = purchases.map(p => p.tier);

        if (purchasedTiers.length === 0) {
            return { purchasedTiers: [], highestTier: null, accessibleTiers: [] };
        }

        // Determine highest tier
        const tierLevels: Record<Tier, number> = { HEIRESS: 1, EMPRESS: 2, SOVEREIGN: 3 };
        let highestLevel = 0;
        let highestTier: Tier = 'HEIRESS';

        for (const tier of purchasedTiers) {
            if (tierLevels[tier] > highestLevel) {
                highestLevel = tierLevels[tier];
                highestTier = tier;
            }
        }

        // Calculate accessible tiers based on highest
        const accessibleTiers: Tier[] = [];
        if (highestLevel >= 1) accessibleTiers.push('HEIRESS');
        if (highestLevel >= 2) accessibleTiers.push('EMPRESS');
        if (highestLevel >= 3) accessibleTiers.push('SOVEREIGN');

        return { purchasedTiers, highestTier, accessibleTiers };
    }

    async getTierPricing(): Promise<Array<{
        tier: Tier;
        price: number;
        name: string;
        description: string;
    }>> {
        return Object.entries(TIER_PRICES).map(([tier, info]) => ({
            tier: tier as Tier,
            price: info.amount / 100,
            name: info.name,
            description: info.description,
        }));
    }

    async handleCheckoutComplete(session: Stripe.Checkout.Session): Promise<void> {
        const { userId, tier, type } = session.metadata || {};

        if (type === 'tier_purchase' && userId && tier) {
            await this.handleTierPurchase(session, userId, tier as Tier);
        }
    }

    private async handleTierPurchase(
        session: Stripe.Checkout.Session,
        userId: string,
        tier: Tier,
    ): Promise<void> {
        // Check if already exists (idempotency)
        const existing = await this.prisma.tierPurchase.findFirst({
            where: { stripePaymentId: session.payment_intent as string },
        });

        if (existing) return;

        await this.prisma.tierPurchase.create({
            data: {
                userId,
                tier,
                stripePaymentId: session.payment_intent as string,
                amount: session.amount_total ? session.amount_total / 100 : 0,
                currency: session.currency || 'usd',
            },
        });
    }

    private async getOrCreateCustomer(userId: string, email: string): Promise<string> {
        // Check if user has any existing purchase with customer ID
        const existingPurchase = await this.prisma.tierPurchase.findFirst({
            where: { userId },
        });

        // For now, just create new customer each time (can be optimized later)
        const customer = await this.stripe.customers.create({
            email,
            metadata: { userId },
        });

        return customer.id;
    }
}
