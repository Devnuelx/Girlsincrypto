import { EmailService } from './email.service';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    testEmail(body: {
        to: string;
        type: 'ebook' | 'mentorship';
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
