import { IsUUID } from "class-validator";

export class UuidParamDto {
    @IsUUID('4', { message: 'Parameter id harus UUID versi 4 yang valid' })
    id: string;
}