import Redis from 'ioredis';

export class RedisClient {
  private static client: Redis;

  static getClient(redisUrl: string): Redis {
    if (!RedisClient.client) {
      RedisClient.client = new Redis(redisUrl, {
        tls: redisUrl.startsWith('rediss://') ? {} : undefined,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
        keepAlive: 0,
        retryStrategy: (times) => {
          if (times > 3) return null;
          return Math.min(times * 100, 2000);
        },
      });
    }
    return RedisClient.client;
  }
}
