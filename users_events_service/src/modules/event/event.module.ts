import { Module } from '@nestjs/common';
import { EventController } from './controllers';
import { EventService } from './services';
import { EventRepository, EventRequestRepository } from './repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from 'src/entities';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from 'src/common/constants/services';
import { EventRequest } from 'src/entities/event-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity, EventRequest]),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATION_HOST'),
            port: configService.get('NOTIFICATION_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository, EventRequestRepository],
})
export class EventModule {}
