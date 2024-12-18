import { ApiResponseProperty } from "@nestjs/swagger";
import { UserResponseExample } from "./examples";

export class RefreshTokenResponse {
    @ApiResponseProperty({example: UserResponseExample.tokens.accessToken})
    accessToken: string;
  
    @ApiResponseProperty({example: UserResponseExample.tokens.refreshToken})
    refreshToken: string;
  }