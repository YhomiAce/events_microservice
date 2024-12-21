import { Module } from '@nestjs/common';
import { EventController } from './controllers';
import { EventService } from './services';
import { EventRepository, EventRequestRepository } from './repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from 'src/entities';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  NOTIFICATIONS_SERVICE,
  NOTIFICATIONS_SERVICE_QUEUE,
} from 'src/common/constants/services';
import { EventRequest } from 'src/entities/event-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity, EventRequest]),
    ClientsModule.register([
      {
        name: NOTIFICATIONS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: NOTIFICATIONS_SERVICE_QUEUE,
        },
      },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository, EventRequestRepository],
})
export class EventModule {}
