import {createClient} from 'redis';

// Create and configure the Redis client
const redisClient = createClient();
redisClient.connect()

export default redisClient;