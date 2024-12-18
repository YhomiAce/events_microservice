import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';

export const typeOrmPostgresOptions = <TypeOrmModuleOptions>{
  type: 'postgres',
  entities: ['dist/**/*.entity{.tsz,.js}'],
  migrations: ['dist/database/migrations/*{.tsz,.js}'],
  synchronize: false,
  logging: false,
  autoLoadEntities: true,
};

export default registerAs(
  'db.postgres',
  () =>
    <TypeOrmModuleOptions>{
      ...typeOrmPostgresOptions,
      url: process.env.DATABASE_URL,
    },
);
