import { singleton } from 'tsyringe';
import RedisConnection from '../../libs/redis';
import { TAny } from 'src/common/types';

@singleton()
export default class CacheService {
    constructor(private readonly _redisConnection: RedisConnection,) {
    }

    set(key: string, value: string) {
        return this._redisConnection.client.set(key, value);
    }

    get(key: string) {
        return this._redisConnection.client.get(key);
    }
    /**
     * @param key - cache key
     * @param value - value to store
     * @param expire - Exp time in seconds
     * **/
    async setJSON(key: string, value: Record<string, TAny>, expire?: number) {
        await this._redisConnection.client.json.set(key, '$', value);

        if (expire) {
            await this._redisConnection.client.expire(key, expire);
        }

    }

    async getJSON<T>(key: string): Promise<T> {
        return await this._redisConnection.client.json.get(key) as T;
    }
}