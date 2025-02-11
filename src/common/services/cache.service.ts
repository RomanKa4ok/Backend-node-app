import { singleton } from 'tsyringe';
import RedisConnection from '../../libs/redis';

@singleton()
export default class CacheService {
    constructor(private readonly _redisConnection: RedisConnection,) {
    }

    set(key: string, value: string) {
        return this._redisConnection.client.set(key, value);
    }
}