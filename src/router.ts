import { Router } from 'express';
import ArticlesApiController from './plugins/articles/api/articles.controller';
import { injectable } from 'tsyringe';
import UsersController from 'src/plugins/users/api/users.controller';

@injectable()
export default class ServerRouter{
    protected router: Router;

    constructor(
        private readonly _articlesApiController: ArticlesApiController,
        private readonly _usersApiController: UsersController
    ) {
        this.router = Router()
    }

    register() {
        this.router.use('/articles', this._articlesApiController.register());
        this.router.use('/users', this._usersApiController.register());

        return this.router;
    }
}