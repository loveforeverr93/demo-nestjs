import { Injectable } from '@nestjs/common';
import { IRedisService } from './redis.interface';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisUpstashService implements IRedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async get(key: string) {
    return await this.redis.get<string>(key);
  }

  async set(key: string, value: string, ttl: number) {
    await this.redis.set(key, value, { ex: ttl });
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
