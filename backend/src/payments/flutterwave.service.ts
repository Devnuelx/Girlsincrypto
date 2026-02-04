import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const Flutterwave = require('flutterwave-node-v3');

@Injectable()
export class FlutterwaveService {
    private flw: any;
    private readonly logger = new Logger(FlutterwaveService.name);

    constructor(private configHelper: ConfigService) {
        const publicKey = this.configHelper.get<string>('FLW_PUBLIC_KEY');
        const secretKey = this.configHelper.get<string>('FLW_SECRET_KEY');

        if (publicKey && secretKey) {
            this.flw = new Flutterwave(publicKey, secretKey);
        } else {
            this.logger.warn('Flutterwave keys not found in config');
        }
    }

    async initializePayment(data: {
        amount: number;
        currency: string;
        email: string;
        tx_ref: string;
        redirect_url: string;
        customerName?: string;
        meta?: any;
    }) {
        try {
            const payload = {
                tx_ref: data.tx_ref,
                amount: data.amount,
                currency: data.currency,
                redirect_url: data.redirect_url,
                customer: {
                    email: data.email,
                    name: data.customerName || 'Customer',
                },
                meta: data.meta,
                customizations: {
                    title: 'Girls in Crypto Hub',
                    description: 'Payment for Digital Product',
                    logo: 'https://girlsincrypto.com/logo.png', // Replace with real logo
                },
            };

            const response = await this.flw.Payment.initialize(payload);
            return response;
        } catch (error) {
            this.logger.error('Flutterwave Init Error', error);
            throw error;
        }
    }

    async verifyTransaction(transactionId: string) {
        try {
            const response = await this.flw.Transaction.verify({ id: transactionId });
            return response;
        } catch (error) {
            this.logger.error('Flutterwave Verify Error', error);
            throw error;
        }
    }
}
