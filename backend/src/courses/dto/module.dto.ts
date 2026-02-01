import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateModuleDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    orderIndex?: number;
}

export class UpdateModuleDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    orderIndex?: number;
}
