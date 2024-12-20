import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventRepository, EventRequestRepository } from '../repository';
import { ClientProxy } from '@nestjs/microservices';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { NOTIFICATIONS_SERVICE } from '../../../common/constants/services';
import { AppStrings } from '../../../common/messages/app.strings';
import { RequestStatus } from '../../../common/enums';
import { User } from '../../../entities';
import { createEventDto, event, user } from '../../../_mock_/test.mock';
import { ILike, MoreThanOrEqual } from 'typeorm';
import { PaginatedEventListResponse } from '../../../common/responses/event-list.response';
import { EventQueryDto } from '../dtos';

// Mock dependencies
const mockEventRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByIdOrFail: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
};
const mockEventRequestRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findByIdOrFail: jest.fn(),
  update: jest.fn(),
};
const mockNotificationService = {
  emit: jest.fn(),
};

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: EventRepository, useValue: mockEventRepository },
        {
          provide: EventRequestRepository,
          useValue: mockEventRequestRepository,
        },
        { provide: NOTIFICATIONS_SERVICE, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw an error if the event date is in the past or today', async () => {
      const data = { ...createEventDto, date: new Date('2024-01-20') };

      await expect(service.create(user, data)).rejects.toThrow(
        new BadRequestException(AppStrings.INVALID_EVENT_DATE),
      );
    });

    it('should create and return an event', async () => {
      const createdEvent = { id: '1', ...event, createdBy: user };
      mockEventRepository.create.mockResolvedValue(createdEvent);

      const result = await service.create(user, createEventDto);
      expect(result).toEqual(createdEvent);
      expect(mockEventRepository.create).toHaveBeenCalledWith({
        ...createEventDto,
        createdBy: user,
      });
    });
  });

  describe('findAllUserEvent', () => {
    it('should return all events created by the user', async () => {
      const mockEvents = [
        { id: '1', title: 'Event 1' },
        { id: '2', title: 'Event 2' },
      ];

      mockEventRepository.findAll.mockResolvedValue(mockEvents);

      const result = await service.findAllUserEvent(user);
      expect(result).toEqual(mockEvents);
      expect(Array.isArray(result)).toBeTruthy();
      expect(mockEventRepository.findAll).toHaveBeenCalledWith({
        where: { createdBy: { id: user.id } },
      });
    });
  });

  describe('findOne', () => {
    it('should return the event with the given id', async () => {
      const eventId = '1';

      mockEventRepository.findByIdOrFail.mockResolvedValue(event);

      const result = await service.findOne(eventId);
      expect(result).toEqual(event);
      expect(mockEventRepository.findByIdOrFail).toHaveBeenCalledWith(eventId, [
        'createdBy',
      ]);
    });
  });

  describe('findAll', () => {
    it('should return paginated events based on query parameters', async () => {
      const query: EventQueryDto = {
        date: new Date('2024-01-01'),
        category: 'Music',
        page: 1,
        pageSize: 2,
      };
      const mockEvents = [
        { id: '1', title: 'Event 1', createdBy: { id: '1' } },
        { id: '2', title: 'Event 2', createdBy: { id: '2' } },
      ];
      const mockCount = 5;

      mockEventRepository.findAll.mockResolvedValue(mockEvents);
      mockEventRepository.count.mockResolvedValue(mockCount);

      const result = await service.findAll(query);

      expect(result.data).toEqual(mockEvents);
      expect(result.meta.itemCount).toBe(mockCount);
      expect(mockEventRepository.findAll).toHaveBeenCalledWith({
        where: {
          date: MoreThanOrEqual(query.date),
          category: ILike('%Music%'),
        },
        take: query.pageSize,
        skip: (query.page - 1) * query.pageSize,
        relations: ['createdBy'],
      });
      expect(mockEventRepository.count).toHaveBeenCalledWith({
        where: {
          date: MoreThanOrEqual(query.date),
          category: ILike('%Music%'),
        },
      });
    });
  });

  describe('requestList', () => {
    it('should return a list of pending event requests for the user', async () => {
      const mockRequests = [
        { id: '1', status: RequestStatus.PENDING },
        { id: '2', status: RequestStatus.PENDING },
      ];

      mockEventRequestRepository.findAll.mockResolvedValue(mockRequests);

      const result = await service.requestList(user);
      expect(result).toEqual(mockRequests);
      expect(Array.isArray(mockRequests)).toBeTruthy();
      expect(mockEventRequestRepository.findAll).toHaveBeenCalledWith({
        where: {
          status: RequestStatus.PENDING,
          event: {
            createdBy: {
              id: user.id,
            },
          },
        },
      });
    });
  });

  describe('joinEventRequest', () => {
    it('should throw an error if the request already exists', async () => {
      const data = { eventId: '1' };

      mockEventRepository.findByIdOrFail.mockResolvedValue(event);
      mockEventRequestRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(service.joinEventRequest(user, data)).rejects.toThrow(
        new BadRequestException(AppStrings.REQUEST_EXIST),
      );
    });

    it('should throw an error if the user is the event creator', async () => {
      const data = { eventId: '1' };

      mockEventRepository.findByIdOrFail.mockResolvedValue(event);
      mockEventRequestRepository.findOne.mockResolvedValue(null);

      await expect(service.joinEventRequest(user, data)).rejects.toThrow(
        new BadRequestException(AppStrings.REQUEST_FORBIDDEN),
      );
    });

    it('should create a join request and notify the event creator', async () => {
      const data = { eventId: '1' };
      const requester: User = {
        ...user,
        id: '2',
        email: 'requester@example.com',
        fullName: 'John Doe',
      } as User;

      mockEventRepository.findByIdOrFail.mockResolvedValue(event);
      mockEventRequestRepository.findOne.mockResolvedValue(null);

      await service.joinEventRequest(requester, data);
      console.log({ userId: requester.id, creatorId: event.createdBy.id });
      expect(mockEventRequestRepository.create).toHaveBeenCalledWith({
        event,
        user: requester,
      });

      expect(mockNotificationService.emit).toHaveBeenCalledWith(
        'SEND_JOIN_REQUEST',
        {
          eventTitle: event.title,
          requesterName: requester.fullName,
          email: event.createdBy.email,
          name: event.createdBy.fullName,
        },
      );
    });
  });

  describe('acceptOrRejectJoinRequest', () => {
    it('should throw an error if the event does not belong to the user', async () => {
      const data = { requestId: '2', accept: true };
      const request = {
        id: '1',
        event: { id: '1' },
        user: {
          id: '2',
          email: 'requester@example.com',
          fullName: 'Requester',
        },
      };

      mockEventRequestRepository.findByIdOrFail.mockResolvedValue(request);
      mockEventRepository.findById.mockResolvedValue(event);

      await expect(
        service.acceptOrRejectJoinRequest({ ...user, id: '2' } as User, data),
      ).rejects.toThrow(new ForbiddenException(AppStrings.FORBIDDEN_RESOURCE));
    });

    it('should accept a join request and notify the requester', async () => {
      const data = { requestId: '1', accept: true };
      const request = {
        id: '1',
        event,
        user: {
          id: '2',
          email: 'requester@example.com',
          fullName: 'Requester',
        },
      };

      mockEventRequestRepository.findByIdOrFail.mockResolvedValue(request);
      mockEventRepository.findById.mockResolvedValue(event);

      await service.acceptOrRejectJoinRequest(user, data);

      expect(mockEventRequestRepository.update).toHaveBeenCalledWith(
        data.requestId,
        {
          status: RequestStatus.ACCEPTED,
        },
      );

      expect(mockNotificationService.emit).toHaveBeenCalledWith(
        'SEND_JOIN_REQUEST_RESPONSE',
        {
          eventTitle: event.title,
          name: request.user.fullName,
          email: request.user.email,
          status: RequestStatus.ACCEPTED,
        },
      );
    });

    it('should reject a join request and notify the requester', async () => {
      const data = { requestId: '1', accept: false };
      const request = {
        id: '1',
        event,
        user: {
          id: '2',
          email: 'requester@example.com',
          fullName: 'Requester',
        },
      };

      mockEventRequestRepository.findByIdOrFail.mockResolvedValue(request);
      mockEventRepository.findById.mockResolvedValue(event);

      await service.acceptOrRejectJoinRequest(user, data);

      expect(mockEventRequestRepository.update).toHaveBeenCalledWith(
        data.requestId,
        {
          status: RequestStatus.REJECTED,
        },
      );

      expect(mockNotificationService.emit).toHaveBeenCalledWith(
        'SEND_JOIN_REQUEST_RESPONSE',
        {
          eventTitle: event.title,
          name: request.user.fullName,
          email: request.user.email,
          status: RequestStatus.REJECTED,
        },
      );
    });
  });
});
