import { RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
export declare class StripeWebhookController {
    private readonly config;
    private readonly paymentsService;
    private stripe;
    constructor(config: ConfigService, paymentsService: PaymentsService);
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
