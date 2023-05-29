import redisClient from "../../config/redis";



export async function scanAndDelete(pattern: string, count = 10000) {
  let cursor = 0;
  // delete any paths with query string matches
  const reply = await redisClient.scan(cursor, { MATCH: pattern, COUNT: count });
  for (const key of reply.keys) {
    cursor = reply.cursor;

    await redisClient.del(key);
  }
}
