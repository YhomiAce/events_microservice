import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmPostgresOptions } from './postgres/postgres.config';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

/**
 * This data source is used for Typeorm migration that runs outside of Nestjs
 */

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });


const connectionSource = {
  ...typeOrmPostgresOptions,
  type: 'postgres',
  url: process.env.DATABASE_URL,
};

const AppDataSource = new DataSource(connectionSource as DataSourceOptions);

AppDataSource.initialize()
  .then(() => {
    Logger.log('Data Source has been initialized!!');
  })
  .catch((err) => {
    Logger.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
