import { PaymentsService } from './payments.service';
import { User, Tier } from '@prisma/client';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getTierPricing(): Promise<{
        tier: Tier;
        price: number;
        name: string;
        description: string;
    }[]>;
    getMyTiers(user: User): Promise<{
        purchasedTiers: Tier[];
        highestTier: Tier | null;
        accessibleTiers: Tier[];
    }>;
    createTierCheckout(user: User, tier: string): Promise<{
        url: string;
    }>;
    initializeProductPayment(body: {
        productId: string;
        email: string;
        name: string;
    }): Promise<{
        link: any;
    }>;
    verifyFlutterwave(transactionId: string, txRef: string): Promise<{
        url: string;
    }>;
}
