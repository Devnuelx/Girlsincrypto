import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeWebhookController } from './stripe-webhook.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { FlutterwaveService } from './flutterwave.service';
import { ProductsModule } from '../products/products.module';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [EnrollmentsModule, ProductsModule, EmailModule, AuthModule],
    controllers: [PaymentsController, StripeWebhookController],
    providers: [PaymentsService, FlutterwaveService],
    exports: [PaymentsService, FlutterwaveService],
})
export class PaymentsModule { }
