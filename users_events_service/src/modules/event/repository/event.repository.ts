import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../../core/base.classes/entity.repository';
import { EventEntity } from '../../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventRepository extends EntityRepository<EventEntity> {
  constructor(
    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>,
  ) {
    super(repository);
  }
}
