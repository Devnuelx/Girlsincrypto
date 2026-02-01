import {
    Controller,
    Post,
    Headers,
    Req,
    RawBodyRequest,
    BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import Stripe from 'stripe';
import { Request } from 'express';

@Controller('webhooks/stripe')
export class StripeWebhookController {
    private stripe: Stripe;

    constructor(
        private readonly config: ConfigService,
        private readonly paymentsService: PaymentsService,
    ) {
        this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2023-10-16',
        });
    }

    @Post()
    async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: RawBodyRequest<Request>,
    ) {
        const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');

        if (!signature || !webhookSecret) {
            throw new BadRequestException('Missing signature or webhook secret');
        }

        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                req.rawBody!,
                signature,
                webhookSecret,
            );
        } catch (err) {
            throw new BadRequestException(`Webhook error: ${(err as Error).message}`);
        }

        switch (event.type) {
            case 'checkout.session.completed':
                await this.paymentsService.handleCheckoutComplete(
                    event.data.object as Stripe.Checkout.Session,
                );
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return { received: true };
    }
}
