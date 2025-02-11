import { createClient } from 'redis';
import { singleton } from 'tsyringe';
import config from '../../config';
import LoggerService from '../../common/services/logger.service';

const { REDIS_URL } = config;

@singleton()
export default class RedisConnection {
    private readonly _redisClient: ReturnType<typeof createClient>;

    constructor(private readonly _logger: LoggerService,) {
        process.on('exit', () => this.closeConnection());

        this._redisClient = createClient({
            url: REDIS_URL,
        });

        this._redisClient.on('connect', () => {
            this._logger.info('Connected to Redis');
        });

        this._redisClient.on('error', (err) => {
            this._logger.error(`Error: ${err}`);
        });
    }

    get client() {
        return this._redisClient;
    }

    createConnection() {
        return this._redisClient.connect();
    }

    closeConnection() {
        return this._redisClient.quit();
    }
}