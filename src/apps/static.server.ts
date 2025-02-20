import 'reflect-metadata';
import type { Express } from 'express';
import * as express from 'express';
import * as http from 'node:http';
import helmet from 'helmet';
import config from '../config';
import { createPGConnection } from 'src/db';
import { container, injectable } from 'tsyringe';
import MongoConnection from 'src/db/mongo';
import LoggerService from 'src/common/services/logger.service';
import AuthModule from 'src/plugins/auth/auth.module';
import StaticRouter from 'src/apps/static-router';
import FilesService from 'src/common/services/files-service';

@injectable()
export default class StaticServer {
    app: Express;

    constructor(
        private readonly _staticRouter: StaticRouter,
        private readonly _mongoConnection: MongoConnection,
        private readonly _authModule: AuthModule,
        private readonly _logger: LoggerService,
        private readonly _filesService: FilesService,
    ) {
        this.app = express();
    }

    async register() {
        const port = config.STATIC_PORT;

        this.app.use(helmet())

        this.app.use('/static', this._staticRouter.register())

        await Promise.all([
            createPGConnection(),
            this._mongoConnection.createMongoConnection()
        ])

        await this._filesService.init();

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

const server = container.resolve(StaticServer);

server.register();