import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Tier } from '@prisma/client';
import Stripe from 'stripe';
import { FlutterwaveService } from './flutterwave.service';
import { EmailService } from '../email/email.service';
export declare class PaymentsService {
    private readonly config;
    private readonly prisma;
    private readonly flwService;
    private readonly emailService;
    private stripe;
    private readonly logger;
    constructor(config: ConfigService, prisma: PrismaService, flwService: FlutterwaveService, emailService: EmailService);
    createTierCheckout(userId: string, tier: Tier): Promise<{
        url: string;
    }>;
    initializeProductPayment(data: {
        productId: string;
        email: string;
        name: string;
    }): Promise<{
        link: any;
    }>;
    verifyFlutterwaveTransaction(transactionId: string, txRef: string): Promise<{
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
