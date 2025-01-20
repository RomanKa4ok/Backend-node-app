import {Express} from 'express';
import * as express from "express";
import * as http from "node:http";
import router from "./router";
import helmet from "helmet";
import config from "./config";
import { createPGConnection } from './db/typeorm';

export default class Server {
    app: Express;

    constructor() {
        this.app = express();
    }

    async register() {
        const port = config.PORT;

        this.app.use(helmet())

        this.app.use('/api', router);

        await createPGConnection();

        return new Promise<void>((resolve, reject) => {
            http.createServer(this.app).listen((port), () => {
                console.log(`Server listening on port ${port}! Open http://localhost:${port} to see the app`);
                resolve();
            });
        });
    }
}