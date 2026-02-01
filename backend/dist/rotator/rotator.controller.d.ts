import { Response, Request } from 'express';
import { RotatorService } from './rotator.service';
export declare class RotatorController {
    private readonly rotatorService;
    constructor(rotatorService: RotatorService);
    join(tenantSlug: string, req: Request, res: Response): Promise<void>;
    private getClientIp;
}
