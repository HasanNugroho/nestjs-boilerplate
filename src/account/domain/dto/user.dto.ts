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
        description: "user name",
        example: "adam"
    })
    @IsString()
    name: string

    @ApiProperty({
        description: "user fullname",
        example: "adam smith"
    })
    @IsString()
    fullname: string

    @ApiProperty({
        description: "username",
        example: "adam"
    })
    @IsString()
    username: string

    @ApiProperty({
        description: "password",
        example: "adam123"
    })
    @MinLength(6)
    @IsString()
    password: string
}