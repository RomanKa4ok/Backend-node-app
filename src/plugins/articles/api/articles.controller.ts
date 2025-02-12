import EntityController from 'src/common/classes/entity-controller';
import type { Articles } from 'src/db';
import ArticlesService from 'src/plugins/articles/services/articles.service';
import { injectable } from 'tsyringe';
import LoggerService from 'src/common/services/logger.service';
import { CreateOneArticlesRequest, CreateOneArticlesRequestBody } from 'src/plugins/articles/types/api.types';
import { SuccessResponse } from 'src/common/classes/api-controller';
import { pick } from 'lodash';
import MiddlewaresService from 'src/common/services/middlewares.service';
import ArticlesListQuerySchema from 'src/plugins/articles/schemas/articles-list-query.schema';
import AuthMiddlewares from 'src/plugins/auth/api/auth.middlewares';

@injectable()
export default class ArticlesApiController extends EntityController<Articles> {
    declare service: ArticlesService;

    constructor(
        service: ArticlesService,
        logger: LoggerService,
        private readonly _authMiddlewares: AuthMiddlewares,
        private readonly _middlewares: MiddlewaresService
    ) {
        super(service, logger);
    }

    override register() {
        this.get(
            '/:id',
            this.getOne
        );
        this.get(
            '/',
            this._authMiddlewares.requireAuth(),
            this._middlewares.validateQuery(ArticlesListQuerySchema),
            this.getListPaged
        );
        this.post(
            '/',
            this.createOne
        );
        this.put(
            '/:id',
            this.updateOne
        );
        this.delete(
            '/:id',
            this.deleteOne
        );

        return super.register()
    }

    override async createOne(request: CreateOneArticlesRequest): Promise<SuccessResponse<Articles>> {
        const payload = pick(
            request.body,
            ['title', 'content', 'createdById'] as (keyof CreateOneArticlesRequestBody)[]
        );

        const article = await this.service.createOne(payload);

        return this.toSuccessResponse(article, 'Article Created!')
    }
}
