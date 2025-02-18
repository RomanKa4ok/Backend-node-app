import { Router } from 'express';
import { injectable } from 'tsyringe';
import FilesStaticController from 'src/plugins/files/api/files-static.controller';

@injectable()
export default class StaticRouter{
    protected router: Router;

    constructor(private readonly _filesApiController: FilesStaticController,) {
        this.router = Router()
    }

    register() {
        this.router.use('/files', this._filesApiController.register());

        return this.router;
    }
}