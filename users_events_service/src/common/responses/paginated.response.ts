import { ApiResponseProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { PageMetaDto } from "../dtos";

export class PaginatedResponse<T> {
  @IsArray()
  @ApiResponseProperty()
  readonly data: T[];

  @ApiResponseProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
