import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('NotificationsService', () => {
  let notificationsService: NotificationsService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    notificationsService =
      module.get<NotificationsService>(NotificationsService);
    mailerService = module.get<MailerService>(MailerService);
  });

  describe('welcomeNotification', () => {
    it('should send a welcome email and log success', async () => {
      const payload = { name: 'John Doe', toEmail: 'john@example.com' };
      jest.spyOn(mailerService, 'sendMail').mockResolvedValueOnce(undefined);

      await notificationsService.welcomeNotification(payload);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: payload.toEmail,
        subject: 'Welcome to Event Social App!',
        template: './welcome',
        context: { name: payload.name },
      });
    });
  });

  describe('joinEventRequest', () => {
    it('should send a join event request email and log success', async () => {
      const payload = {
        eventTitle: 'Music Fest',
        requesterName: 'Alice',
        email: 'organizer@example.com',
        name: 'Bob',
      };
      jest.spyOn(mailerService, 'sendMail').mockResolvedValueOnce(undefined);

      await notificationsService.joinEventRequest(payload);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: payload.email,
        subject: `Request to join ${payload.eventTitle}`,
        template: './event-request',
        context: {
          name: payload.name,
          requesterName: payload.requesterName,
          event: payload.eventTitle,
        },
      });
    });
  });

  describe('eventRequestResponse', () => {
    it('should send an event request response email and log success', async () => {
      const payload = {
        eventTitle: 'Music Fest',
        status: 'approved',
        email: 'user@example.com',
        name: 'Bob',
      };
      jest.spyOn(mailerService, 'sendMail').mockResolvedValueOnce(undefined);

      await notificationsService.eventRequestResponse(payload);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: payload.email,
        subject: 'Event Request Reply',
        template: './event-reply',
        context: {
          name: payload.name,
          event: payload.eventTitle,
          status: payload.status,
        },
      });
    });
  });
});
