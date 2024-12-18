import type { EventEntity } from "../../entities";
import { PaginatedResponse } from "./paginated.response";


export class PaginatedEventListResponse extends PaginatedResponse<EventEntity> {}
