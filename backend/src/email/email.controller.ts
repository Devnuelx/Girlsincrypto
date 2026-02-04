import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    /**
     * Test email endpoint - Admin only
     * POST /api/email/test
     * Body: { "to": "test@example.com", "type": "ebook" | "mentorship" }
     */
    @Post('test')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async testEmail(@Body() body: { to: string; type: 'ebook' | 'mentorship' }) {
        const { to, type } = body;

        if (type === 'mentorship') {
            await this.emailService.sendMentorshipBooking(
                to,
                'Test Customer',
                'One Week Onboarding (TEST)',
            );
        } else {
            await this.emailService.sendEbookDelivery(
                to,
                'Test Customer',
                'Crypto Investing Starterpack (TEST)',
                'https://example.com/test-ebook.pdf',
            );
        }

        return { success: true, message: `Test ${type} email sent to ${to}` };
    }
}
