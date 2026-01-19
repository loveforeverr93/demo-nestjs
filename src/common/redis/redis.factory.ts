import { RedisLocalService } from './redis.local..service';
import { RedisUpstashService } from './redis.upstash.service';

export const RedisFactory = {
  provide: 'REDIS_SERVICE',
  useClass:
    process.env.NODE_ENV === 'development'
      ? RedisLocalService
      : RedisUpstashService,
};
