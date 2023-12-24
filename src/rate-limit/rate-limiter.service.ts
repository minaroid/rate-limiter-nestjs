import { Injectable } from '@nestjs/common';
import { REDIS_USERS_API_KEYS } from 'src/constants';
import { RateLimitInterface } from 'src/interfaces/rate-limit.interface';
import { RedisService } from 'src/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RateLimiterService {
  constructor(private readonly redis: RedisService) {}

  async createApiKey(capacity: number, window: number): Promise<string> {
    const key = uuidv4();
    await this.redis.hSetJsonValue(REDIS_USERS_API_KEYS, key, {
      rateLimit: {
        capacity,
        window,
      },
    });
    return key;
  }

  async isValidApiKey(apiKay: string): Promise<Record<string, any>> {
    return this.redis.hGetJsonValue(REDIS_USERS_API_KEYS, apiKay ?? '');
  }

  refill(rateLimit: RateLimitInterface) {
    const now = Math.floor(Date.now() / 1000);

    if (now < rateLimit.nextRefillTime) {
      return;
    }

    rateLimit.nextRefillTime = now + rateLimit.window;
    rateLimit.lastRefillTime = now;

    rateLimit.tokens = rateLimit.capacity;
  }

  async take(apiKay: string, data: Record<string, any>): Promise<boolean> {
    const rateLimit: RateLimitInterface = data.rateLimit;
    if (!rateLimit) {
      return true;
    }

    this.refill(rateLimit);

    if (rateLimit.tokens > 0) {
      rateLimit.tokens -= 1;
      await this.redis.hSetJsonValue(REDIS_USERS_API_KEYS, apiKay, {
        rateLimit,
      });
      return true;
    }

    return false;
  }
}
