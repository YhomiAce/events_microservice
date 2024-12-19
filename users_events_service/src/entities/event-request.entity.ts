import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import BaseEntity from './base.entity';
import { EventEntity } from './event.entity';
import { User } from './user.entity';
import { RequestStatus } from 'src/common/enums';

@Entity()
export class EventRequest extends BaseEntity {
  @ManyToOne(() => EventEntity, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE"
  })
  event: EventEntity;

  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE"
  })
  user: User;

  @Column({
    type: 'enum',
    enum: [
      RequestStatus.PENDING,
      RequestStatus.ACCEPTED,
      RequestStatus.REJECTED,
    ],
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
