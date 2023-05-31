import {createClient} from 'redis';
import dotenv from 'dotenv'
dotenv.config()

// Create and configure the Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL, socket:{connectTimeout: 20000}
});
redisClient.connect().then(() => console.log('connected to redis'))

export default redisClient;

