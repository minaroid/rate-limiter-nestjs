import { Injectable } from '@nestjs/common';
import { REDIS_USERS_API_KEYS } from 'src/constants';
import { RedisService } from 'src/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AppService {
  constructor(private readonly redis: RedisService) {}

  async generateApiKey() {
    const key = uuidv4();
    await this.redis.hSet(REDIS_USERS_API_KEYS, key, {
      // 5 request per 30 seconds.
      rateLimit: {
        capacity: 5,
        window: 30,
      },
    });
    return { key };
  }
}
