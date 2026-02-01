import { Module } from '@nestjs/common';
import { RotatorService } from './rotator.service';
import { RotatorController } from './rotator.controller';
import { TrafficController } from './traffic.controller';
import { LeadsModule } from '../leads/leads.module';

@Module({
    imports: [LeadsModule],
    controllers: [RotatorController, TrafficController],
    providers: [RotatorService],
    exports: [RotatorService],
})
export class RotatorModule { }
