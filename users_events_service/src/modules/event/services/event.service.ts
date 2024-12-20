import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { EventRepository, EventRequestRepository } from '../repository';
import { CreateEventDto, EventRequestDto, RequestDecisionDto } from '../dtos';
import { EventEntity, EventRequest, User } from '../../../entities';
import { DeepPartial, FindOptionsWhere, ILike, MoreThanOrEqual } from 'typeorm';
import { EventQueryDto } from '../dtos/list-event.dto';
import { Pagination } from '../../../common/utils/pagination';
import { PaginatedEventListResponse } from '../../../common/responses/event-list.response';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '../../../common/constants/services';
import { AppStrings } from '../../../common/messages/app.strings';
import {
  SEND_JOIN_REQUEST,
  SEND_JOIN_REQUEST_RESPONSE,
} from '../../../config/events';
import { RequestStatus } from '../../../common/enums';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventRequestRepository: EventRequestRepository,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

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
      throw new BadRequestException(AppStrings.INVALID_EVENT_DATE);
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
    return await this.eventRepository.findByIdOrFail(id, ['createdBy']);
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
      relations: ['createdBy'],
    });
    const total = await this.eventRepository.count({ where });
    return new Pagination(results, query?.page, query?.pageSize).paginate(
      total,
    );
  }

  /**
   * Request to Join Event
   *
   * @async
   * @param {User} user
   * @param {EventRequestDto} data
   * @returns {Promise<void>}
   */
  async joinEventRequest(user: User, data: EventRequestDto): Promise<void> {
    const { eventId } = data;
    const event = await this.eventRepository.findByIdOrFail(eventId, [
      'createdBy',
    ]);
    const requestExist = await this.eventRequestRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        event: {
          id: eventId,
        },
      },
    });
    if (requestExist) {
      throw new BadRequestException(AppStrings.REQUEST_EXIST);
    }else if(user.id === event.createdBy.id){
      throw new BadRequestException(AppStrings.REQUEST_FORBIDDEN);
    }
    await this.eventRequestRepository.create({
      event,
      user,
    });

    // Notify the event creator via the Email Notification Service about new join requests.
    this.notificationService.emit(SEND_JOIN_REQUEST, {
      eventTitle: event.title,
      requesterName: user.fullName,
      email: event.createdBy.email,
      name: event.createdBy.fullName,
    });
  }

  /**
   * find event by id
   *
   * @async
   * @param {User} user
   * @returns {Promise<EventRequest[]>}
   */
  async requestList(user: User): Promise<EventRequest[]> {
    const requests = await this.eventRequestRepository.findAll({
      where: {
        status: RequestStatus.PENDING,
        event: {
          createdBy: {
            id: user.id,
          },
        },
      },
    });
    return requests;
  }

  /**
   * Accept/Reject Join Request
   *
   * @async
   * @param {User} owner
   * @param {RequestDecisionDto} data
   * @returns {Promise<void>}
   */
  async acceptOrRejectJoinRequest(
    owner: User,
    data: RequestDecisionDto,
  ): Promise<string> {
    const { requestId, accept } = data;
    const request = await this.eventRequestRepository.findByIdOrFail(requestId);
    const { event, user } = request;
    const eventData = await this.eventRepository.findById(event.id, [
      'createdBy',
    ]);

    // check the event belongs to the user
    if (eventData.createdBy.id !== owner.id) {
      throw new ForbiddenException(AppStrings.FORBIDDEN_RESOURCE);
    }

    const status = accept ? RequestStatus.ACCEPTED : RequestStatus.REJECTED;
    await this.eventRequestRepository.update(requestId, {
      status,
    });

    // Notify the requester via the Email Notification Service.
    this.notificationService.emit(SEND_JOIN_REQUEST_RESPONSE, {
      eventTitle: event.title,
      name: user.fullName,
      email: user.email,
      status,
    });

    return AppStrings.REQUEST_ACTION(status);
  }
}
