import { Router } from 'express';
import ArticlesApiController from '../plugins/articles/api/articles.controller';
import { injectable } from 'tsyringe';
import UsersController from 'src/plugins/users/api/users.controller';
import AuthController from 'src/plugins/auth/api/auth.controller';
import FilesController from 'src/plugins/files/api/files-api.controller';

@injectable()
export default class ServerRouter{
    protected router: Router;

    constructor(
        private readonly _articlesApiController: ArticlesApiController,
        private readonly _usersApiController: UsersController,
        private readonly _signUpApiController: AuthController,
        private readonly _filesApiController: FilesController,
    ) {
        this.router = Router()
    }

    register() {
        this.router.use('/articles', this._articlesApiController.register());
        this.router.use('/users', this._usersApiController.register());
        this.router.use('/auth', this._signUpApiController.register());
        this.router.use('/files', this._filesApiController.register());

        return this.router;
    }
}