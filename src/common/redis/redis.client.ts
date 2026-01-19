import Redis from 'ioredis';

export class RedisClient {
  private static client: Redis;

  static getClient(redisUrl: string): Redis {
    if (!RedisClient.client) {
      RedisClient.client = new Redis(redisUrl, {
        tls: {
          rejectUnauthorized: false,
        },
        maxRetriesPerRequest: null,
        keepAlive: 1000,
        retryStrategy: (times) => {
          return Math.min(times * 100, 2000);
        },
        connectTimeout: 5000,
      });
      RedisClient.client.on('connect', () => console.log('✅ Redis connected'));
      RedisClient.client.on('error', (err) =>
        console.error('❌ Redis Error:', err),
      );
      RedisClient.client.on('reconnecting', () =>
        console.log('🔄 Redis reconnecting...'),
      );
    }
    return RedisClient.client;
  }
}
