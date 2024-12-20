import { CreateEventDto } from 'src/modules/event/dtos';
import { EventEntity, User } from '../entities';

export const user = {
  id: '1',
  fullName: 'John Doe',
  email: 'creator@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
} as User;
export const data = { eventId: '1' };
export const event: EventEntity = {
  id: '1',
  title: 'Test Event',
  category: 'CyberSecurity',
  description: 'Event description',
  date: new Date(Date.now() + 24 * 60 * 60 * 1000),
  createdBy: {
    ...user,
  } as User,
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const createEventDto: CreateEventDto = {
  title: 'Test Event',
  category: 'CyberSecurity',
  description: 'Event description',
  date: new Date(Date.now() + 24 * 60 * 60 * 1000),
};
