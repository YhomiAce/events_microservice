import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import BaseEntity from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'events' })
export class EventEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @ManyToOne(() => User, (owner) => owner.events, {
    onDelete: 'CASCADE',
  })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
