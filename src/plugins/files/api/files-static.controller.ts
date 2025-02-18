import { injectable } from 'tsyringe';
import LoggerService from 'src/common/services/logger.service';
import FilesStaticService from 'src/plugins/files/services/files-static.service';
import MiddlewaresService from 'src/common/services/middlewares.service';
import { IdSchema } from 'src/common/schemas';
import type { Response } from 'express';
import { GetStaticTypeRequest } from 'src/plugins/files/types';
import ApiController from 'src/common/classes/api-controller';

@injectable()
export default class FilesStaticController extends ApiController {
    constructor(
        logger: LoggerService,
        private readonly _filesService: FilesStaticService,
        private readonly _middlewares: MiddlewaresService,
    ) {
        super(logger);
    }

    override register() {
        this.router.get(
            '/:id',
            this._middlewares.validateParams(IdSchema),
            this.getFilesStatic.bind(this),
        )

        return super.register();
    }

    protected async getFilesStatic(req: GetStaticTypeRequest, res: Response) {
        const { file, stream } = await this._filesService.getFileStreamById({ id: req.params.id, w: req.query.w });

        res.setHeader('Content-Type', file.type);
        res.setHeader('Content-Length', file.size.toString());

        stream.pipe(res);
    }
}