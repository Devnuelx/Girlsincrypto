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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_1 = require("stripe");
const flutterwave_service_1 = require("./flutterwave.service");
const email_service_1 = require("../email/email.service");
const TIER_PRICES = {
    HEIRESS: {
        amount: 9900,
        name: 'Heiress Tier',
        description: 'Entry level access to foundational crypto courses',
    },
    EMPRESS: {
        amount: 19900,
        name: 'Empress Tier',
        description: 'Mid-tier access including Heiress + advanced courses',
    },
    SOVEREIGN: {
        amount: 49900,
        name: 'Sovereign Tier',
        description: 'Full access to ALL courses on the platform',
    },
};
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(config, prisma, flwService, emailService) {
        this.config = config;
        this.prisma = prisma;
        this.flwService = flwService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        this.stripe = new stripe_1.default(this.config.get('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2023-10-16',
        });
    }
    async createTierCheckout(userId, tier) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const existingPurchase = await this.prisma.tierPurchase.findFirst({
            where: { userId, tier },
        });
        if (existingPurchase) {
            throw new common_1.BadRequestException(`You already own the ${tier} tier`);
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
        return { url: session.url };
    }
    async initializeProductPayment(data) {
        const product = await this.prisma.product.findUnique({ where: { id: data.productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const tx_ref = `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const redirect_url = `${this.config.get('BACKEND_URL')}/payments/verify-flutterwave`;
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
        if (response.status === 'success') {
            return { link: response.data.link };
        }
        else {
            throw new common_1.BadRequestException('Payment initialization failed');
        }
    }
    async verifyFlutterwaveTransaction(transactionId, txRef) {
        const response = await this.flwService.verifyTransaction(transactionId);
        if (response.status === 'success' && response.data.status === 'successful') {
            const meta = response.data.meta;
            const productId = meta.productId;
            const email = meta.email;
            const name = meta.name;
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
            const product = await this.prisma.product.findUnique({ where: { id: productId } });
            if (product) {
                if (product.type === 'MENTORSHIP') {
                    await this.emailService.sendMentorshipBooking(email, name, product.title);
                }
                else if (product.type === 'EBOOK' && product.fileUrl) {
                    await this.emailService.sendEbookDelivery(email, name, product.title, product.fileUrl);
                }
            }
            return { url: `${this.config.get('FRONTEND_URL')}/success?status=success&product=${encodeURIComponent(product?.title || '')}` };
        }
        else {
            return { url: `${this.config.get('FRONTEND_URL')}/failed` };
        }
    }
    async getUserTiers(userId) {
        const purchases = await this.prisma.tierPurchase.findMany({
            where: { userId },
            select: { tier: true },
        });
        const purchasedTiers = purchases.map(p => p.tier);
        if (purchasedTiers.length === 0) {
            return { purchasedTiers: [], highestTier: null, accessibleTiers: [] };
        }
        const tierLevels = { HEIRESS: 1, EMPRESS: 2, SOVEREIGN: 3 };
        let highestLevel = 0;
        let highestTier = 'HEIRESS';
        for (const tier of purchasedTiers) {
            if (tierLevels[tier] > highestLevel) {
                highestLevel = tierLevels[tier];
                highestTier = tier;
            }
        }
        const accessibleTiers = [];
        if (highestLevel >= 1)
            accessibleTiers.push('HEIRESS');
        if (highestLevel >= 2)
            accessibleTiers.push('EMPRESS');
        if (highestLevel >= 3)
            accessibleTiers.push('SOVEREIGN');
        return { purchasedTiers, highestTier, accessibleTiers };
    }
    async getTierPricing() {
        return Object.entries(TIER_PRICES).map(([tier, info]) => ({
            tier: tier,
            price: info.amount / 100,
            name: info.name,
            description: info.description,
        }));
    }
    async handleCheckoutComplete(session) {
        const { userId, tier, type } = session.metadata || {};
        if (type === 'tier_purchase' && userId && tier) {
            await this.handleTierPurchase(session, userId, tier);
        }
    }
    async handleTierPurchase(session, userId, tier) {
        const existing = await this.prisma.tierPurchase.findFirst({
            where: { stripePaymentId: session.payment_intent },
        });
        if (existing)
            return;
        await this.prisma.tierPurchase.create({
            data: {
                userId,
                tier,
                stripePaymentId: session.payment_intent,
                amount: session.amount_total ? session.amount_total / 100 : 0,
                currency: session.currency || 'usd',
            },
        });
    }
    async getOrCreateCustomer(userId, email) {
        const existingPurchase = await this.prisma.tierPurchase.findFirst({
            where: { userId },
        });
        const customer = await this.stripe.customers.create({
            email,
            metadata: { userId },
        });
        return customer.id;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        flutterwave_service_1.FlutterwaveService,
        email_service_1.EmailService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map