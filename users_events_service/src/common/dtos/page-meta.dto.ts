import {ApiProperty} from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly pageSize: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage?: boolean;

  @ApiProperty()
  readonly hasNextPage?: boolean;

  constructor({itemCount, pageCount, page, pageSize}: PageMetaDto) {
    this.page = page;
    this.pageSize = pageSize;
    this.itemCount = itemCount;
    this.pageCount = pageCount;
  }
}
