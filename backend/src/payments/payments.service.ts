import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Tier } from '@prisma/client';
import { FlutterwaveService } from './flutterwave.service';
import { EmailService } from '../email/email.service';

// Tier pricing configuration (in USD)
const TIER_PRICES: Record<Tier, { amount: number; name: string; description: string }> = {
    HEIRESS: {
        amount: 99, // $99
        name: 'Heiress Tier',
        description: 'Entry level access to foundational crypto courses',
    },
    EMPRESS: {
        amount: 199, // $199
        name: 'Empress Tier',
        description: 'Mid-tier access including Heiress + advanced courses',
    },
    SOVEREIGN: {
        amount: 499, // $499
        name: 'Sovereign Tier',
        description: 'Full access to ALL courses on the platform',
    },
};

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly flwService: FlutterwaveService,
        private readonly emailService: EmailService,
    ) {}

    async createTierCheckout(userId: string, tier: Tier): Promise<{ link: string }> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Check if already purchased this tier
        const existingPurchase = await this.prisma.tierPurchase.findFirst({
            where: { userId, tier },
        });
        if (existingPurchase) {
            throw new BadRequestException(`You already own the ${tier} tier`);
        }

        const tierInfo = TIER_PRICES[tier];
        const tx_ref = `tier_${tier}_${userId}_${Date.now()}`;
        const redirect_url = `${this.config.get('BACKEND_URL')}/payments/verify-flutterwave`;

        const response = await this.flwService.initializePayment({
            amount: tierInfo.amount,
            currency: 'USD',
            email: user.email,
            customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer',
            tx_ref,
            redirect_url,
            meta: {
                type: 'tier_purchase',
                userId,
                tier,
                tierName: tierInfo.name,
            },
        });

        if (response.status === 'success') {
            return { link: response.data.link };
        } else {
            this.logger.error('Flutterwave tier checkout failed', response);
            throw new BadRequestException('Payment initialization failed');
        }
    }

    async initializeProductPayment(data: { productId: string; email: string; name: string }) {
        const product = await this.prisma.product.findUnique({ where: { id: data.productId } });
        if (!product) throw new NotFoundException('Product not found');

        const tx_ref = `product_${data.productId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const redirect_url = `${this.config.get('BACKEND_URL')}/payments/verify-flutterwave`;

        const response = await this.flwService.initializePayment({
            amount: Number(product.price),
            currency: 'USD',
            email: data.email,
            customerName: data.name,
            tx_ref,
            redirect_url,
            meta: {
                type: 'product_purchase',
                productId: product.id,
                email: data.email,
                name: data.name,
            },
        });

        if (response.status === 'success') {
            return { link: response.data.link };
        } else {
            throw new BadRequestException('Payment initialization failed');
        }
    }

    async verifyFlutterwaveTransaction(transactionId: string, txRef: string) {
        const response = await this.flwService.verifyTransaction(transactionId);

        if (response.status === 'success' && response.data.status === 'successful') {
            const meta = response.data.meta;
            const purchaseType = meta?.type;

            if (purchaseType === 'tier_purchase') {
                // Handle tier purchase
                return this.handleTierPurchaseVerification(transactionId, response.data, meta);
            } else {
                // Handle product purchase (e-book, mentorship)
                return this.handleProductPurchaseVerification(transactionId, response.data, meta);
            }
        } else {
            return { url: `${this.config.get('FRONTEND_URL')}/failed?reason=payment_failed` };
        }
    }

    private async handleTierPurchaseVerification(
        transactionId: string,
        paymentData: any,
        meta: any,
    ) {
        const { userId, tier, tierName } = meta;

        // Check if already exists (idempotency)
        const existing = await this.prisma.tierPurchase.findFirst({
            where: { transactionId: String(transactionId) },
        });

        if (!existing) {
            // Create tier purchase record
            await this.prisma.tierPurchase.create({
                data: {
                    userId,
                    tier: tier as Tier,
                    transactionId: String(transactionId),
                    amount: paymentData.amount,
                    currency: paymentData.currency || 'USD',
                },
            });

            // Get user email for confirmation
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (user) {
                // Send purchase confirmation email
                await this.emailService.sendTierPurchaseConfirmation(
                    user.email,
                    user.firstName || 'Valued Customer',
                    tierName,
                    paymentData.amount,
                );
            }
        }

        return {
            url: `${this.config.get('FRONTEND_URL')}/success?status=success&tier=${tier}`,
        };
    }

    private async handleProductPurchaseVerification(
        transactionId: string,
        paymentData: any,
        meta: any,
    ) {
        const { productId, email, name } = meta;

        // Record Purchase
        await this.prisma.purchase.create({
            data: {
                productId,
                guestEmail: email,
                guestName: name,
                amount: paymentData.amount,
                currency: paymentData.currency || 'USD',
                status: 'COMPLETED',
                transactionId: String(transactionId),
                metadata: paymentData,
            },
        });

        // Send Email based on product type
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (product) {
            if (product.type === 'MENTORSHIP') {
                await this.emailService.sendMentorshipBooking(email, name, product.title);
            } else if (product.type === 'EBOOK' && product.fileUrl) {
                await this.emailService.sendEbookDelivery(email, name, product.title, product.fileUrl);
            }
        }

        return {
            url: `${this.config.get('FRONTEND_URL')}/success?status=success&product=${encodeURIComponent(product?.title || '')}`,
        };
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
            price: info.amount,
            name: info.name,
            description: info.description,
        }));
    }
}
