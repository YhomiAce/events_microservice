import { Module } from '@nestjs/common';
import { EventController } from './controllers';
import { EventService } from './services';
import { EventRepository } from './repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
