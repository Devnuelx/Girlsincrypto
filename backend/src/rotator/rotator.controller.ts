import {
    Controller,
    Get,
    Param,
    Res,
    Req,
    HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { RotatorService } from './rotator.service';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class RotatorController {
    constructor(private readonly rotatorService: RotatorService) { }

    /**
     * Main rotator endpoint
     * GET /:tenantSlug/join
     * 
     * Rate limited to 5 requests per minute per IP
     */
    @Get(':tenantSlug/join')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    async join(
        @Param('tenantSlug') tenantSlug: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        // Extract IP and User-Agent for logging
        const ip = this.getClientIp(req);
        const userAgent = req.headers['user-agent'] || undefined;

        try {
            const result = await this.rotatorService.getNextGroup(
                tenantSlug,
                ip,
                userAgent,
            );

            // Redirect to WhatsApp invite or waiting room
            return res.redirect(HttpStatus.FOUND, result.redirectUrl);
        } catch (error) {
            // Tenant not found or other error → waiting room
            console.error(`Rotator error for ${tenantSlug}:`, error);
            return res.redirect(
                HttpStatus.FOUND,
                '/waiting-room?status=error'
            );
        }
    }

    private getClientIp(req: Request): string {
        // Handle proxies (Cloudflare, nginx, etc.)
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
            return ips.trim();
        }
        return req.ip || req.socket?.remoteAddress || 'unknown';
    }
}
