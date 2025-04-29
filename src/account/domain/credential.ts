import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class Credential {
    @ApiProperty({
        description: "username or email",
        required: true,
    })
    @IsString()
    identifier: string;

    @ApiProperty({
        description: "password",
        required: true,
    })
    @IsString()
    password: string;

    isEmailIdentifier(): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(this.identifier);
    }
}

export class CredentialResponse {
    accessToken: string;
    refreshToken: string;
    id: string;

    constructor(
        accessToken: string,
        refreshToken: string,
        id: string,
    ) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
    }
}
