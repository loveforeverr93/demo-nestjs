import { Module } from '@nestjs/common';
import { RedisLocalService } from './redis.local..service';
import { RedisUpstashService } from './redis.upstash.service';
import { RedisFactory } from './redis.factory';

@Module({
  providers: [RedisLocalService, RedisUpstashService, RedisFactory],
  exports: ['REDIS_SERVICE'],
})
export class RedisModule {}
