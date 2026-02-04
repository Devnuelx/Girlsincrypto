import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Tier } from '@prisma/client';
import Stripe from 'stripe';
import { FlutterwaveService } from './flutterwave.service';
import { EmailService } from '../email/email.service';

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
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly flwService: FlutterwaveService,
        private readonly emailService: EmailService,
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

    async initializeProductPayment(data: { productId: string; email: string; name: string }) {
        const product = await this.prisma.product.findUnique({ where: { id: data.productId } });
        if (!product) throw new NotFoundException('Product not found');

        const tx_ref = `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const redirect_url = `${this.config.get('BACKEND_URL')}/payments/verify-flutterwave`; // Verify endpoint

        const response = await this.flwService.initializePayment({
            amount: Number(product.price),
            currency: 'USD',
            email: data.email,
            customerName: data.name,
            tx_ref,
            redirect_url,
            meta: {
                productId: product.id,
                email: data.email,
                name: data.name,
            },
        });

        // MOCK SUCCESS
        // const response = { status: 'success', data: { link: 'https://flutterwave.com/mock-payment' } };

        if (response.status === 'success') {
            return { link: response.data.link };
        } else {
            throw new BadRequestException('Payment initialization failed');
        }
    }

    async verifyFlutterwaveTransaction(transactionId: string, txRef: string) {
        const response = await this.flwService.verifyTransaction(transactionId);

        // MOCK
        // const response = { status: 'success', data: { status: 'successful', amount: 99, currency: 'USD', meta: { productId: 'mock', email: 'mock', name: 'mock' } } };

        if (response.status === 'success' && response.data.status === 'successful') {
            const meta = response.data.meta;
            const productId = meta.productId;
            const email = meta.email;
            const name = meta.name;

            // Record Purchase
            await this.prisma.purchase.create({
                data: {
                    productId,
                    guestEmail: email,
                    guestName: name,
                    amount: response.data.amount,
                    currency: response.data.currency,
                    status: 'COMPLETED',
                    transactionId: String(transactionId),
                    metadata: response.data,
                }
            });

            // Send Email based on product type
            const product = await this.prisma.product.findUnique({ where: { id: productId } });
            if (product) {
                if (product.type === 'MENTORSHIP') {
                    // Send mentorship booking email with Calendly link
                    await this.emailService.sendMentorshipBooking(email, name, product.title);
                } else if (product.type === 'EBOOK' && product.fileUrl) {
                    // Send e-book delivery email with download link
                    await this.emailService.sendEbookDelivery(email, name, product.title, product.fileUrl);
                }
            }

            // Redirect to Success Page
            return { url: `${this.config.get('FRONTEND_URL')}/success?status=success&product=${encodeURIComponent(product?.title || '')}` };
        } else {
            return { url: `${this.config.get('FRONTEND_URL')}/failed` };
        }
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
