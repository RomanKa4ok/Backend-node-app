import type { Application, Router } from 'express';
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

@injectable()
export default class ArticlesApiController extends EntityController<Articles> {
    protected override basePath: string = '/articles'
    declare service: ArticlesService;

    constructor(
        service: ArticlesService,
        logger: LoggerService,
        private readonly _middlewares: MiddlewaresService,
    ) {
        super(service, logger);
    }

    override register(app: Application | Router): void {
        this.router.get(
            '/:id',
            this.apiMethod(this.getOne)
        );
        this.router.get(
            '/',
            this.middleware(this._middlewares.validateQuery(ArticlesListQuerySchema)),
            this.apiMethod(this.getListPaged)
        );
        this.router.post(
            '/',
            this.apiMethod(this.createOne)
        );
        this.router.put(
            '/:id',
            this.apiMethod(this.updateOne)
        );
        this.router.delete(
            '/:id',
            this.apiMethod(this.deleteOne)
        );

        super.register(app);
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
