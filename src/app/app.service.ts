import { Injectable } from '@nestjs/common';
import { RateLimiterService } from 'src/rate-limit/rate-limiter.service';
@Injectable()
export class AppService {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  async generateApiKey(): Promise<object> {
    // 500 requests per 30 seconds.
    const key = await this.rateLimiterService.createApiKey(500, 30);
    return { key };
  }
}
