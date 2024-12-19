import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailSendService } from './mail-service';
import { NotifyEmailDto } from './dtos';
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
    console.log("🚀 ~ NotificationsService ~ welcomeNotification ~ payload:", payload)
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
    const { eventTitle, requesterName, toEmail } = payload;
    this.logger.log("MICROSERVICE REQUEST", payload)
    try {
      await this.mailerService.sendMail({
        to: toEmail,
        subject: 'Welcome to Waseet App! Confirm your Email',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: {
          name: requesterName,
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
  async eventRequestResponse(payload: NotifyEmailDto): Promise<void> {
    const { eventTitle, requesterName, toEmail } = payload;
    try {
      await this.mailerService.sendMail({
        to: toEmail,
        subject: 'Welcome to Waseet App! Confirm your Email',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: {
          name: requesterName,
          event: eventTitle,
        },
      });
      this.logger.log('E-Mail sent Successfully');
    } catch (error) {
      this.logger.debug(error);
    }
  }
}
