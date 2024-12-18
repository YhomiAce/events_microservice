
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessTtl: process.env.JWT_ACCESS_TTL,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshTtl: process.env.JWT_REFRESH_TTL,
}));
