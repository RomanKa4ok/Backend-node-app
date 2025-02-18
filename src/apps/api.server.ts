import 'reflect-metadata';
import type { Express } from 'express';
import * as express from 'express';
import * as http from 'node:http';
import * as bodyParser from 'body-parser';
import * as fileUpload from 'express-fileupload';
import helmet from 'helmet';
import config from '../config';
import { createPGConnection } from 'src/db';
import ServerRouter from './router';
import { container, injectable } from 'tsyringe';
import MongoConnection from 'src/db/mongo';
import LoggerService from 'src/common/services/logger.service';
import AuthModule from 'src/plugins/auth/auth.module';
import RedisConnection from 'src/libs/redis';

@injectable()
export default class ApiServer {
    app: Express;

    constructor(
        private readonly _serverRouter: ServerRouter,
        private readonly _mongoConnection: MongoConnection,
        private readonly _redisConnection: RedisConnection,
        private readonly _authModule: AuthModule,
        private readonly _logger: LoggerService,
    ) {
        this.app = express();
    }

    async register() {
        const port = config.PORT;

        this.app.use(helmet())
        this.app.use(bodyParser.json())
        this.app.use(fileUpload());

        this.app.use('/api', this._serverRouter.register())

        await Promise.all([
            createPGConnection(),
            this._redisConnection.createConnection(),
            this._mongoConnection.createMongoConnection()
        ])

        return await new Promise<void>((resolve) => {
            http.createServer(this.app).listen(
                (port),
                () => {
                    this._authModule.load();
                    this._logger.info(`Server listening on port ${port}! Open http://localhost:${port} to see the app`);
                    resolve();
                }
            );
        });
    }
}

const server = container.resolve(ApiServer);

server.register();