import { LeadsService, LeadCaptureDto } from './leads.service';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    captureLead(dto: LeadCaptureDto): Promise<{
        success: boolean;
        leadId: string;
    }>;
}
