import { injectable } from 'tsyringe';
import EntityController from 'src/common/classes/entity-controller';
import { Files } from 'src/db'
import LoggerService from 'src/common/services/logger.service';
import FilesApiService from 'src/plugins/files/services/files-api.service';
import MiddlewaresService from 'src/common/services/middlewares.service';
import { IdSchema } from 'src/common/schemas';

@injectable()
export default class FilesController extends EntityController<Files> {
    constructor(
        private readonly _middlewares: MiddlewaresService,
        filesService: FilesApiService,
        logger: LoggerService,
    ) {
        super(filesService, logger);
    }

    override register() {
        this.get(
            '/:id',
            this._middlewares.validateParams(IdSchema),
            this.getOne
        );

        return super.register();
    }
}