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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const payments_service_1 = require("./payments.service");
const stripe_1 = require("stripe");
let StripeWebhookController = class StripeWebhookController {
    constructor(config, paymentsService) {
        this.config = config;
        this.paymentsService = paymentsService;
        this.stripe = new stripe_1.default(this.config.get('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2023-10-16',
        });
    }
    async handleWebhook(signature, req) {
        const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
        if (!signature || !webhookSecret) {
            throw new common_1.BadRequestException('Missing signature or webhook secret');
        }
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook error: ${err.message}`);
        }
        switch (event.type) {
            case 'checkout.session.completed':
                await this.paymentsService.handleCheckoutComplete(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        return { received: true };
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handleWebhook", null);
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, common_1.Controller)('webhooks/stripe'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        payments_service_1.PaymentsService])
], StripeWebhookController);
//# sourceMappingURL=stripe-webhook.controller.js.map