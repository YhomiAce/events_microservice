import { ApiResponseProperty } from "@nestjs/swagger";

export class DataResponse<T> {
    @ApiResponseProperty()
    data: T
}