import { BadRequestException, Injectable } from '@nestjs/common';
import { EventRepository } from '../repository';
import { CreateEventDto } from '../dtos';
import { EventEntity, User } from 'src/entities';
import {
  DeepPartial,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { EventQueryDto } from '../dtos/list-event.dto';
import { Pagination } from 'src/common/utils/pagination';
import { PaginatedEventListResponse } from 'src/common/responses/event-list.response';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Create Event
   *
   * @async
   * @param {User} user
   * @param {UpdateUserDto} data
   * @returns {Promise<EventEntity>}
   */
  async create(user: User, data: CreateEventDto): Promise<EventEntity> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // check that the event date is greater than today
    if (new Date(data.date) <= today) {
      throw new BadRequestException("Event Date can't be in the past or today");
    }
    const payload: DeepPartial<EventEntity> = {
      ...data,
      createdBy: user,
    };
    const event = await this.eventRepository.create(payload);
    return event;
  }

  /**
   * List user Events
   *
   * @async
   * @param {User} user
   * @returns {Promise<EventEntity[]>}
   */
  async findAllUserEvent(user: User): Promise<EventEntity[]> {
    const events = await this.eventRepository.findAll({
      where: { createdBy: { id: user.id } },
    });
    return events;
  }

  /**
   * find event by id
   *
   * @async
   * @param {string} id
   * @returns {Promise<EventEntity>}
   */
  async findOne(id: string): Promise<EventEntity> {
    return await this.eventRepository.findByIdOrFail(id, ["createdBy"]);
  }

  /**
   * List All Events
   *
   * @async
   * @param {EventQueryDto} query
   * @returns {Promise<PaginatedEventListResponse>}
   */
  async findAll(query: EventQueryDto): Promise<PaginatedEventListResponse> {
    const where: FindOptionsWhere<EventEntity> = {};
    if (query.date) {
      where.date = MoreThanOrEqual(query.date);
    }
    if (query.category) {
      where.category = ILike(`%${query.category}%`);
    }
    const skip = query?.page ? Number(query.page) - 1 : 0;
    const pageSize = query?.pageSize ?? 10;
    const results = await this.eventRepository.findAll({
      where,
      take: pageSize,
      skip: skip * pageSize,
      relations: ["createdBy"]
    });
    const total = await this.eventRepository.count({ where });
    return new Pagination(results, query?.page, query?.pageSize).paginate(
      total,
    );
  }
}
