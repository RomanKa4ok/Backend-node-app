import type { Application } from 'express';
import { Router } from 'express';
import ArticlesApiController from './plugins/articles/api/articles.controller';
import { injectable } from 'tsyringe';
import UsersController from 'src/plugins/users/api/users.controller';

@injectable()
export default class ServerRouter{
    private _router: Router;

    constructor(
        private readonly _articlesApiController: ArticlesApiController,
        private readonly _usersApiController: UsersController
    ) {
        this._router = Router()
    }

    register(app: Application) {
        this._articlesApiController.register(this._router);
        this._usersApiController.register(this._router);

        app.use('/api', this._router);
    }
}