import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from '../services';
import { EventRequestDto, RequestDecisionDto, EventQueryDto } from '../dtos';
import { SuccessResponse } from '../../../common/responses';
import { mockCreateEventDto, mockeUser, mockEvent, mockRequests } from '../../../_mock_/test.mock';
import { AppStrings } from '../../../common/messages/app.strings';

// Mock Data
const mockEventRequestDto: EventRequestDto = { eventId: '1' };
const mockRequestDecisionDto: RequestDecisionDto = {
  requestId: '1',
  accept: true,
};
const mockEventQueryDto: EventQueryDto = {
  date: new Date('2024-01-01'),
  category: 'Music',
  page: 1,
  pageSize: 2,
};

const mockEventService = {
  create: jest.fn().mockResolvedValue(mockEvent),
  findAllUserEvent: jest.fn().mockResolvedValue([mockEvent]),
  findAll: jest.fn().mockResolvedValue([mockEvent]),
  findOne: jest.fn().mockResolvedValue(mockEvent),
  joinEventRequest: jest.fn(),
  requestList: jest.fn().mockResolvedValue(mockRequests),
  acceptOrRejectJoinRequest: jest
    .fn()
    .mockResolvedValue('Event request Accepted'),
};

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [{ provide: EventService, useValue: mockEventService }],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const result = await controller.create(mockeUser, mockCreateEventDto);
      expect(service.create).toHaveBeenCalledWith(
        mockeUser,
        mockCreateEventDto,
      );
      expect(result.message).toEqual(AppStrings.EVENT_CREATED);
    });
  });

  describe('findAllUserEvent', () => {
    it('should return all user events', async () => {
      const result = await controller.findAllUserEvent(mockeUser);
      expect(service.findAllUserEvent).toHaveBeenCalledWith(mockeUser);
      expect(Array.isArray(result.data)).toBeTruthy();
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      const result = await controller.findAll(mockEventQueryDto);
      expect(service.findAll).toHaveBeenCalledWith(mockEventQueryDto);
      expect(Array.isArray(result.data)).toBeTruthy();
    });
  });

  describe('findOne', () => {
    it('should return a single event by ID', async () => {
      const result = await controller.findOne(mockEvent.id);
      expect(service.findOne).toHaveBeenCalledWith(mockEvent.id);
      expect(result.data).toEqual(mockEvent);
    });
  });

  describe('joinEventRequest', () => {
    it('should send a join request for an event', async () => {
      const result = await controller.joinEventRequest(
        mockeUser,
        mockEventRequestDto,
      );
      expect(service.joinEventRequest).toHaveBeenCalledWith(
        mockeUser,
        mockEventRequestDto,
      );
      expect(result.message).toEqual(AppStrings.JOIN_EVENT_REQUEST);
    });
  });

  describe('eventRequests', () => {
    it('should return all event requests', async () => {
      const result = await controller.eventRequests(mockeUser);
      expect(service.requestList).toHaveBeenCalledWith(mockeUser);
      expect(Array.isArray(result.data)).toBeTruthy();
    });
  });

  describe('requestDecision', () => {
    it('should process a join request decision', async () => {
      const result = await controller.requestDecision(
        mockeUser,
        mockRequestDecisionDto,
      );
      expect(service.acceptOrRejectJoinRequest).toHaveBeenCalledWith(
        mockeUser,
        mockRequestDecisionDto,
      );
      expect(result.message).toEqual(AppStrings.REQUEST_ACTION('Accepted'));
    });
  });
});
