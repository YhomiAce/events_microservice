import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailSendService } from './mail-service';
import { NotifyEmailDto, RequestDecisionNotificationDto } from './dtos';
import { WelcomeEmailDto } from './dtos/welcome-email.dto';

@Injectable()
export class NotificationsService implements MailSendService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Send Welcome Email
   * @async
   * @param {NotifyEmailDto} payload
   * @returns {Promise<void>}
   */
  async welcomeNotification(payload: WelcomeEmailDto): Promise<void> {
    const { name, toEmail } = payload;
    try {
      await this.mailerService.sendMail({
        to: toEmail,
        subject: 'Welcome to Event Social App!',
        template: './welcome', // `.hbs` extension is appended automatically
        context: {
          name,
        },
      });
      this.logger.log('E-Mail sent Successfully');
    } catch (error) {
      this.logger.error(error);
    }
  }
  /**
   * Send Join Event Request
   * @async
   * @param {NotifyEmailDto} payload
   * @returns {Promise<void>}
   */
  async joinEventRequest(payload: NotifyEmailDto): Promise<void> {
    const { eventTitle, requesterName, email, name } = payload;
    this.logger.log("MICROSERVICE REQUEST", payload)
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Request to join ${eventTitle}`,
        template: './event-request',
        context: {
          name,
          requesterName,
          event: eventTitle,
        },
      });
      this.logger.log('E-Mail sent Successfully');
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Send Email Confirmation
   * @async
   * @param {NotifyEmailDto} payload
   * @returns {Promise<void>}
   */
  async eventRequestResponse(payload: RequestDecisionNotificationDto): Promise<void> {
    const { eventTitle, status, email, name } = payload;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Event Request Reply',
        template: './event-reply',
        context: {
          name,
          event: eventTitle,
          status
        },
      });
      this.logger.log('E-Mail sent Successfully');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
