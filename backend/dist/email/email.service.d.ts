import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configHelper;
    private transporter;
    private readonly logger;
    private readonly CALENDLY_LINK;
    private readonly fromEmail;
    constructor(configHelper: ConfigService);
    sendEbookDelivery(email: string, customerName: string, productName: string, fileUrl: string): Promise<void>;
    sendMentorshipBooking(email: string, customerName: string, productName: string): Promise<void>;
    sendProductDelivery(email: string, productName: string, fileUrl: string, productType?: string, customerName?: string): Promise<void>;
}
