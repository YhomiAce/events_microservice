import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload, RpcException } from '@nestjs/microservices';
import { NotifyEmailDto, RequestDecisionNotificationDto } from './dtos';
import {
  SEND_JOIN_REQUEST,
  SEND_JOIN_REQUEST_RESPONSE,
  SEND_WELCOME_EMAIL,
} from '../common/constants';
import { MicroserviceRequestFilter } from '../common/exceptions';
import { WelcomeEmailDto } from './dtos/welcome-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Send Request to Join Event
   *
   * @async
   * @param {NotifyEmailDto} data
   * @returns {Promise<void>}
   */
  @UseFilters(new MicroserviceRequestFilter())
  @EventPattern(SEND_JOIN_REQUEST)
  async sendJoinRequest(
    @Payload(new ValidationPipe({ whitelist: true })) data: NotifyEmailDto,
  ): Promise<void> {
    this.notificationsService.joinEventRequest(data);
  }

  /**
   * Send Welcome mail for new user
   *
   * @async
   * @param {WelcomeEmailDto} data
   * @returns {Promise<void>}
   */
  @EventPattern(SEND_WELCOME_EMAIL)
  async sendWelcomeEmail(@Payload() data: WelcomeEmailDto): Promise<void> {
    this.notificationsService.welcomeNotification(data);
  }

  /**
   * Notify requester about event request
   *
   * @async
   * @param {RequestDecisionNotificationDto} data
   * @returns {Promise<void>}
   */
  @EventPattern(SEND_JOIN_REQUEST_RESPONSE)
  async notifyRequestResponse(
    @Payload(new ValidationPipe({ whitelist: true }))
    data: RequestDecisionNotificationDto,
  ): Promise<void> {
    this.notificationsService.eventRequestResponse(data);
  }
}
