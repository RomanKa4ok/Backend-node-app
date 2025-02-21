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
import CronJobService from 'src/plugins/cron/jobs/services/cron.service';

@injectable()
export default class CronServer {
    app: Express;

    constructor(
        private readonly _mongoConnection: MongoConnection,
        private readonly _logger: LoggerService,
        private readonly _cronJobService: CronJobService,
    ) {
        this.app = express();
    }

    async register() {
        const port = config.CRON_PORT;

        this.app.use(helmet())

        await Promise.all([
            createPGConnection(),
            this._mongoConnection.createMongoConnection()
        ]);

        this.app.get('/', (_req, res) => {
            const jobs = this._cronJobService.getJobs();
            const html = jobs.filter((job) => job.runOnStart)
                jobs.map((job) => `<p>${job.getJobName()} is running: ${job.isRunning()}</p>`).join('')
            res.send(html);
        })

        return await new Promise<void>((resolve) => {
            http.createServer(this.app).listen(
                (port),
                () => {
                    this._logger.info(`Server listening on port ${port}! Open http://localhost:${port} to see the app`);
                    this._cronJobService.start();
                    resolve();
                }
            );
        });
    }
}

const server = container.resolve(CronServer);

server.register();