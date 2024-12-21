import {
  NotifyEmailDto,
  RequestDecisionNotificationDto,
  WelcomeEmailDto,
} from '../dtos';

export interface MailSendService {
  welcomeNotification(payload: WelcomeEmailDto): Promise<void>;
  joinEventRequest(payload: NotifyEmailDto): Promise<void>;
  eventRequestResponse(payload: RequestDecisionNotificationDto): Promise<void>;
}
