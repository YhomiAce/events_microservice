import { NotifyEmailDto } from "./dtos";
import { WelcomeEmailDto } from "./dtos/welcome-email.dto";



export interface MailSendService {
  welcomeNotification(payload: WelcomeEmailDto): Promise<void>;
  joinEventRequest(payload: NotifyEmailDto): Promise<void>;
  eventRequestResponse(payload: NotifyEmailDto): Promise<void>;
}
