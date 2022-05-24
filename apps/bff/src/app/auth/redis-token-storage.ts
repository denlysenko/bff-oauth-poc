/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from 'redis';
import { TokenStorage } from './token-storage';

export class RedisTokenStorage extends TokenStorage {
  constructor(private readonly _redisClient: ReturnType<typeof createClient>) {
    super();
  }

  async get(key: string): Promise<any> {
    await this._redisClient.connect();
    const result = await this._redisClient.get(key);
    await this._redisClient.quit();

    return JSON.parse(result);
  }

  async set(key: string, value: any): Promise<void> {
    await this._redisClient.connect();
    await this._redisClient.set(key, JSON.stringify(value));
    await this._redisClient.quit();
  }

  async delete(key: string): Promise<void> {
    await this._redisClient.connect();
    await this._redisClient.del(key);
    await this._redisClient.quit();
  }
}
