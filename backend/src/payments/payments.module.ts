import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeWebhookController } from './stripe-webhook.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
    imports: [EnrollmentsModule],
    controllers: [PaymentsController, StripeWebhookController],
    providers: [PaymentsService],
    exports: [PaymentsService],
})
export class PaymentsModule { }
