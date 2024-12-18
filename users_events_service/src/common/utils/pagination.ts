import { PaginatedResponse } from "../responses";

export class Pagination<T> {
  constructor(
    private readonly data: T[],
    private readonly page: number = 1,
    private readonly pageSize: number = 10,
  ) {}

  /**
   * Paginate
   *
   * @async
   * @returns {Promise<PaginatedResponse<T>>}
   */
  paginate(total: number): PaginatedResponse<T> {
    const pageCount = Math.ceil(total / this.pageSize);

    return {
      data: this.data,
      meta: {
        itemCount: total,
        pageCount,
        page: this.page,
        pageSize: this.pageSize,
      },
    };
  }
}
