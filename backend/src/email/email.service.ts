import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);
    private readonly CALENDLY_LINK = 'https://calendly.com/contact-girlsincryptohub';
    private readonly fromEmail: string;

    constructor(private configHelper: ConfigService) {
        // Hostinger SMTP Configuration
        this.transporter = nodemailer.createTransport({
            host: this.configHelper.get('SMTP_HOST') || 'smtp.hostinger.com',
            port: parseInt(this.configHelper.get('SMTP_PORT') || '465'),
            secure: true, // true for port 465 (SSL)
            auth: {
                user: this.configHelper.get('SMTP_USER'),
                pass: this.configHelper.get('SMTP_PASS'),
            },
        });

        // Use the SMTP_USER as the from email
        this.fromEmail = `"Girls in Crypto Hub" <${this.configHelper.get('SMTP_USER') || 'noreply@girlsincryptohub.com'}>`;
    }

    /**
     * Send e-book delivery email with download link
     */
    async sendEbookDelivery(email: string, customerName: string, productName: string, fileUrl: string) {
        try {
            await this.transporter.sendMail({
                from: this.fromEmail,
                to: email,
                subject: `Your E-Book is Ready: ${productName}`,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf9f6;">
                        <div style="background: linear-gradient(135deg, #F2419C 0%, #ff6bba 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Your Purchase!</h1>
                        </div>

                        <div style="padding: 40px 30px; background: white;">
                            <p style="font-size: 16px; color: #333;">Hey ${customerName || 'Queen'},</p>

                            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                Your e-book <strong>"${productName}"</strong> is ready for download!
                                Click the button below to get instant access.
                            </p>

                            <div style="text-align: center; margin: 35px 0;">
                                <a href="${fileUrl}"
                                   style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #F2419C 0%, #ff6bba 100%);
                                          color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;
                                          box-shadow: 0 4px 15px rgba(242, 65, 156, 0.4);">
                                    Download Your E-Book
                                </a>
                            </div>

                            <p style="font-size: 14px; color: #666; margin-top: 30px;">
                                <strong>Direct link:</strong><br>
                                <a href="${fileUrl}" style="color: #F2419C; word-break: break-all;">${fileUrl}</a>
                            </p>

                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                            <p style="font-size: 14px; color: #888; text-align: center;">
                                Need help? Reply to this email or reach out to us on Instagram
                                <a href="https://instagram.com/girlsincryptohub" style="color: #F2419C;">@girlsincryptohub</a>
                            </p>
                        </div>

                        <div style="background: #1a0a2e; padding: 25px; text-align: center;">
                            <p style="color: #888; font-size: 12px; margin: 0;">
                                Girls in Crypto Hub - Empowering Women in Crypto
                            </p>
                        </div>
                    </div>
                `,
            });
            this.logger.log(`E-book delivery email sent to ${email} for ${productName}`);
        } catch (error) {
            this.logger.error('E-book email sending failed', error);
        }
    }

    /**
     * Send mentorship booking email with Calendly link
     */
    async sendMentorshipBooking(email: string, customerName: string, productName: string) {
        try {
            await this.transporter.sendMail({
                from: this.fromEmail,
                to: email,
                subject: `Book Your Mentorship Session: ${productName}`,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf9f6;">
                        <div style="background: linear-gradient(135deg, #F2419C 0%, #ff6bba 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Your Mentorship Journey!</h1>
                        </div>

                        <div style="padding: 40px 30px; background: white;">
                            <p style="font-size: 16px; color: #333;">Hey ${customerName || 'Queen'},</p>

                            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                Congratulations on investing in yourself! You have purchased
                                <strong>"${productName}"</strong> and we are so excited to work with you.
                            </p>

                            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                Your next step is to <strong>schedule your first mentorship session</strong>.
                                Click the button below to book a time that works best for you.
                            </p>

                            <div style="text-align: center; margin: 35px 0;">
                                <a href="${this.CALENDLY_LINK}"
                                   style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #F2419C 0%, #ff6bba 100%);
                                          color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;
                                          box-shadow: 0 4px 15px rgba(242, 65, 156, 0.4);">
                                    Schedule Your Session
                                </a>
                            </div>

                            <div style="background: #fdf2f8; border-radius: 12px; padding: 20px; margin: 25px 0;">
                                <h3 style="color: #F2419C; margin-top: 0;">What to Expect:</h3>
                                <ul style="color: #555; line-height: 1.8;">
                                    <li>Personalized 1-on-1 crypto guidance</li>
                                    <li>Custom learning roadmap based on your goals</li>
                                    <li>Portfolio review and investment strategies</li>
                                    <li>Direct access to your mentor via messaging</li>
                                </ul>
                            </div>

                            <p style="font-size: 14px; color: #666; margin-top: 30px;">
                                <strong>Booking link:</strong><br>
                                <a href="${this.CALENDLY_LINK}" style="color: #F2419C;">${this.CALENDLY_LINK}</a>
                            </p>

                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                            <p style="font-size: 14px; color: #888; text-align: center;">
                                Questions before your session? Reply to this email or DM us on Instagram
                                <a href="https://instagram.com/girlsincryptohub" style="color: #F2419C;">@girlsincryptohub</a>
                            </p>
                        </div>

                        <div style="background: #1a0a2e; padding: 25px; text-align: center;">
                            <p style="color: #888; font-size: 12px; margin: 0;">
                                Girls in Crypto Hub - Empowering Women in Crypto
                            </p>
                        </div>
                    </div>
                `,
            });
            this.logger.log(`Mentorship booking email sent to ${email} for ${productName}`);
        } catch (error) {
            this.logger.error('Mentorship email sending failed', error);
        }
    }

    /**
     * Legacy method - routes to appropriate email based on product type
     */
    async sendProductDelivery(email: string, productName: string, fileUrl: string, productType?: string, customerName?: string) {
        if (productType === 'MENTORSHIP') {
            await this.sendMentorshipBooking(email, customerName || '', productName);
        } else {
            await this.sendEbookDelivery(email, customerName || '', productName, fileUrl);
        }
    }
}
