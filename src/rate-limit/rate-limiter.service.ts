import { Injectable } from '@nestjs/common';
import { RateLimitInterface } from 'src/interfaces/rate-limit.interface';

@Injectable()
export class RateLimiterService {
  // TODO replaces with the actual redis db.
  private redis: Map<string, any> = new Map([
    [
      'MyApiKey',
      {
        rateLimit: {
          capacity: 2,
          window: 5,
          tokens: 0,
          lastRefillTime: 0,
          nextRefillTime: 0,
        },
      },
    ],
  ]);

  async isValidApiKey(apiKay: string): Promise<boolean> {
    return this.redis.has(apiKay);
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

  async take(apiKay: string): Promise<boolean> {
    const data = this.redis.get(apiKay);
    const rateLimit: RateLimitInterface = data.rateLimit;
    if (!rateLimit) {
      return true;
    }
    this.refill(rateLimit);

    if (rateLimit.tokens > 0) {
      rateLimit.tokens -= 1;
      console.log(rateLimit);
      return true;
    }

    return false;
  }
}
