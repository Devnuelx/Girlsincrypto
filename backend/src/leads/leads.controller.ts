import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { LeadsService, LeadCaptureDto } from './leads.service';
import { Throttle } from '@nestjs/throttler';

@Controller('webhooks')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    /**
     * Lead capture webhook
     * POST /api/webhooks/lead-capture
     * 
     * Rate limited to prevent abuse
     */
    @Post('lead-capture')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    async captureLead(@Body() dto: LeadCaptureDto) {
        console.log('Received Lead Capture Request:', JSON.stringify(dto));
        return this.leadsService.captureLead(dto);
    }
}
