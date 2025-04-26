import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: "user email",
        example: "adam@user.com"
    })
    @IsEmail()
    email: string

    @ApiProperty({
        description: "Nama user",
        example: "adam"
    })
    @IsString()
    name: string

    @ApiProperty({
        description: "password",
        example: "adam123"
    })
    @MinLength(6)
    @IsString()
    password: string
}