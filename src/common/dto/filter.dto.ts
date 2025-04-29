import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class BaseQueryDto {
    @ApiProperty({
        description: "Search keyword",
        required: false,
    })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiProperty({
        description: "Page number for pagination",
        default: 1,
        required: false,
    })
    @Type(() => Number)
    @IsNumber({}, { message: 'Page must be a number' })
    @IsOptional()
    page: number = 1;

    @ApiProperty({
        description: "Number of items per page",
        default: 10,
        required: false,
    })
    @Type(() => Number)
    @IsNumber({}, { message: 'Limit must be a number' })
    @IsOptional()
    limit: number = 10;

    @ApiProperty({
        description: "Field to sort by",
        default: 'created_at',
        required: false,
    })
    @IsOptional()
    @IsString()
    sortBy: string = 'created_at';

    @ApiProperty({
        description: "Sort order (asc or desc)",
        default: 'desc',
        required: false,
        enum: ['asc', 'desc'], // This helps in generating better documentation
    })
    @IsOptional()
    @IsIn(['asc', 'desc'], { message: 'SortOrder must be either "asc" or "desc"' })
    sortOrder: 'asc' | 'desc' = 'desc';
}

export class UuidParamDto {
    @ApiProperty({
        description: "The unique identifier (UUID) for the resource",
        required: true,
    })
    @IsUUID('4', { message: 'The id parameter must be a valid UUID version 4' })
    id: string;
}