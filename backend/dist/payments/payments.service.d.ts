import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Tier } from '@prisma/client';
import Stripe from 'stripe';
export declare class PaymentsService {
    private readonly config;
    private readonly prisma;
    private stripe;
    constructor(config: ConfigService, prisma: PrismaService);
    createTierCheckout(userId: string, tier: Tier): Promise<{
        url: string;
    }>;
    getUserTiers(userId: string): Promise<{
        purchasedTiers: Tier[];
        highestTier: Tier | null;
        accessibleTiers: Tier[];
    }>;
    getTierPricing(): Promise<Array<{
        tier: Tier;
        price: number;
        name: string;
        description: string;
    }>>;
    handleCheckoutComplete(session: Stripe.Checkout.Session): Promise<void>;
    private handleTierPurchase;
    private getOrCreateCustomer;
}
