import type { Express } from 'express';
import * as express from 'express';
import * as http from 'node:http';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import config from './config';
import { createPGConnection } from 'src/db';
import ServerRouter from './router';
import { injectable } from 'tsyringe';

@injectable()
export default class Server {
    app: Express;

    constructor(private readonly _serverRouter: ServerRouter) {
        this.app = express();
    }

    async register() {
        const port = config.PORT;

        this.app.use(helmet())
        this.app.use(bodyParser.json())

        this._serverRouter.register(this.app)

        await createPGConnection();

        return await new Promise<void>((resolve) => {
            http.createServer(this.app).listen(
                (port),
                () => {
                    console.log(`Server listening on port ${port}! Open http://localhost:${port} to see the app`);
                    resolve();
                }
            );
        });
    }
}