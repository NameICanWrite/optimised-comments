/* eslint-disable no-console */

import { Captcha } from '../modules/captcha/Captcha';
import { Comment } from '../modules/comments/Comment';
import { User } from '../modules/users/User';
import { createConnection, DataSourceOptions } from 'typeorm';

const connectDB = async () => {
  try {
    const options: DataSourceOptions = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      logging: [
        'error', 
        // 'query'
      ],
      type: 'postgres',
      entities: [Comment, User, Captcha],
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: true, // getSSLConfig(process.env.SERVER_MODE!),
      synchronize: true
    };
    await createConnection(options);
    console.log('PostgreSQL Connected.');
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
