import { CreateEventDto } from '../modules/event/dtos';
import { EventEntity, User } from '../entities';
import { RequestStatus } from '../common/enums';

export const mockeUser = {
  id: '1',
  fullName: 'John Doe',
  email: 'creator@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
} as User;

export const mockEvent: EventEntity = {
  id: '1',
  title: 'Test Event',
  category: 'CyberSecurity',
  description: 'Event description',
  date: new Date(Date.now() + 24 * 60 * 60 * 1000),
  createdBy: {
    ...mockeUser,
  } as User,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCreateEventDto: CreateEventDto = {
  title: 'Test Event',
  category: 'CyberSecurity',
  description: 'Event description',
  date: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

export const mockRequests = [
  { id: '1', status: RequestStatus.PENDING },
  { id: '2', status: RequestStatus.PENDING },
];

export const mockUpdateUserDto = {
    fullName: "Jane Doe"
}
