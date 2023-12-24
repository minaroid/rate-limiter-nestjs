import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  RedisClientOptions,
  RedisFunctions,
  RedisModules,
  createClient,
} from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
  private client?: ReturnType<typeof createClient>;

  constructor() {}

  async onModuleInit() {
    const options: RedisClientOptions<RedisModules, RedisFunctions> = {
      socket: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
        connectTimeout: 5000,
        reconnectStrategy: false,
      },
    };

    this.client = await createClient(options);
    this.client?.on('error', () =>
      console.error(`=> Failed connect to Redis server`),
    );
    this.client?.on('connect', () =>
      console.log(`=> Connected to Redis server`),
    );

    try {
      await this.client?.connect();
    } catch (err) {}
  }

  async onApplicationShutdown() {
    await this.client?.disconnect();
  }

  async hSetJsonValue(key: string, field: string, value: Record<string, any>) {
    const oldValue = await this.hGetJsonValue(key, field);
    const parsedOldValue = oldValue ? oldValue : {};
    const newValue = { ...parsedOldValue, ...value };
    return await this.client.hSet(key, field, JSON.stringify(newValue));
  }

  async hGetJsonValue(
    key: string,
    field: string,
  ): Promise<Record<string, any> | null> {
    const value = await this.client.hGet(key, field);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }
}
