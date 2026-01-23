import { ConfigService } from '@nestjs/config';
import { RedisLocalService } from '../redis/redis.local..service';
import { RedisUpstashService } from '../redis/redis.upstash.service';

export const RedisProvider = {
  provide: 'REDIS_SERVICE',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const env = config.get<string>('NODE_ENV');

    if (env === 'development') {
      return new RedisLocalService();
    }

    return new RedisUpstashService();
  },
};
