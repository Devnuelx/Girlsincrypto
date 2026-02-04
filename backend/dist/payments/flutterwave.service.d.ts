import { ConfigService } from '@nestjs/config';
export declare class FlutterwaveService {
    private configHelper;
    private flw;
    private readonly logger;
    constructor(configHelper: ConfigService);
    initializePayment(data: {
        amount: number;
        currency: string;
        email: string;
        tx_ref: string;
        redirect_url: string;
        customerName?: string;
        meta?: any;
    }): Promise<any>;
    verifyTransaction(transactionId: string): Promise<any>;
}
