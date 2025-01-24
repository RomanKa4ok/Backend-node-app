import type { Application } from 'express';
import { Router } from 'express';
import ArticlesApiController from './plugins/articles/api/articles.router';
import { injectable } from 'tsyringe';

@injectable()
export default class ServerRouter{
    private _router: Router;

    constructor(private readonly _articlesApiController: ArticlesApiController) {
        this._router = Router()
    }

    register(app: Application) {
        this._articlesApiController.register(this._router);

        app.use('/api', this._router);
    }
}