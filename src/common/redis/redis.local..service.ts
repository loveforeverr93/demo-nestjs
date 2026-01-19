import { Injectable } from '@nestjs/common';
import { IRedisService } from './redis.interface';
import { RedisClient } from './redis.client';

@Injectable()
export class RedisLocalService implements IRedisService {
  private readonly redis = RedisClient.getClient(
    process.env.REDIS_URL ?? 'redis://localhost:6379',
  );

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl: number) {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
