import { Module } from '@nestjs/common';
import { RedisLocalService } from './redis.local..service';
import { RedisUpstashService } from './redis.upstash.service';
import { RedisProvider } from '../provider/redis.provider';

@Module({
  providers: [RedisLocalService, RedisUpstashService, RedisProvider],
  exports: ['REDIS_SERVICE'],
})
export class RedisModule {}
