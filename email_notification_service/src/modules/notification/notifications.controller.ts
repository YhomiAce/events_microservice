import { Controller, UseFilters, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dtos';
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

  @UseFilters(new MicroserviceRequestFilter())
  @EventPattern(SEND_JOIN_REQUEST)
  async sendJoinRequest(
    @Payload(new ValidationPipe({ whitelist: true })) data: NotifyEmailDto,
  ) {
    this.notificationsService.joinEventRequest(data);
  }

  @EventPattern(SEND_WELCOME_EMAIL)
  async sendWelcomeEmail(@Payload() data: WelcomeEmailDto) {
    this.notificationsService.welcomeNotification(data);
  }

  @EventPattern(SEND_JOIN_REQUEST_RESPONSE)
  async notifyRequestResponse(@Payload() data: NotifyEmailDto) {
    this.notificationsService.eventRequestResponse(data);
  }
}
