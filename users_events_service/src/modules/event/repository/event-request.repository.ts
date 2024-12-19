import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../../core/base.classes/entity.repository';
import { EventRequest } from '../../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventRequestRepository extends EntityRepository<EventRequest> {
  constructor(
    @InjectRepository(EventRequest)
    private readonly repository: Repository<EventRequest>,
  ) {
    super(repository);
  }
}
