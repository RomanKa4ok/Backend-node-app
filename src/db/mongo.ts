import { singleton } from 'tsyringe';
import * as process from 'node:process';
import * as mongoose from 'mongoose';
import config from 'src/config';
import LoggerService from 'src/common/services/logger.service';

const { MONGO_LOGS, MONGO_DATABASE_URL } = config

@singleton()
export default class MongoConnection {
    constructor(private readonly _logger: LoggerService) {
        process.on('exit', () => this.closeMongoConnection())

        if (MONGO_LOGS) {
            mongoose.set('debug', (collectionName, method, query, doc) => {
                this._logger.debug('QUERY', { mongoose: { collectionName, method, query, doc } })
            });
        }
    }

    async createMongoConnection() {
        try {
            mongoose.connect(MONGO_DATABASE_URL, {
                autoCreate: true,
            })

            this._logger.info('MongoDB connected successfully!')
        } catch (e: unknown) {
            this._logger.error(`MongoDB connection failed! ${e}`)
        }
    }

    async closeMongoConnection() {
        return await mongoose.disconnect();
    }
}