import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class BaseQueryDto {
    @IsOptional()
    @IsString()
    keyword?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    page = 1;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    limit = 10;

    @IsOptional()
    @IsString()
    sortBy = 'created_at';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder: 'asc' | 'desc' = 'desc';
}

export class UuidParamDto {
    @IsUUID('4', { message: 'The id parameter must be a valid UUID version 4' })
    id: string;
}