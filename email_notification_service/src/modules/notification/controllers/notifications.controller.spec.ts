import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from '../services/notifications.service';

const mockNotificationService = {
  joinEventRequest: jest.fn(),
  welcomeNotification: jest.fn(),
  eventRequestResponse: jest.fn(),
};

describe('NotificationsController', () => {
  let notificationsController: NotificationsController;
  let service: NotificationsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationService },
      ],
    }).compile();

    notificationsController = app.get<NotificationsController>(
      NotificationsController,
    );
    service = app.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(notificationsController).toBeDefined();
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email to a new user', async () => {
      const mockData = { name: 'Jon Snow', toEmail: 'jon@snow.com' };
      await notificationsController.sendWelcomeEmail(mockData);
      expect(service.welcomeNotification).toHaveBeenCalledWith(mockData);
    });
  });

  describe('sendJoinRequest', () => {
    it('should notify the event creator about new join requests.', async () => {
      const mockData = {
        name: 'Jon Snow',
        email: 'jon@snow.com',
        eventTitle: 'Test Event',
        requesterName: 'Arya Stark',
      };
      await notificationsController.sendJoinRequest(mockData);
      expect(service.joinEventRequest).toHaveBeenCalledWith(mockData);
    });
  });

  describe('notifyRequestResponse', () => {
    it('should notify the requester about the join requests reply.', async () => {
      const mockData = {
        name: 'Jon Snow',
        email: 'jon@snow.com',
        eventTitle: 'Test Event',
        status: 'Accepted',
      };
      await notificationsController.notifyRequestResponse(mockData);
      expect(service.eventRequestResponse).toHaveBeenCalledWith(mockData);
    });
  });
});
