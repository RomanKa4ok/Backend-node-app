import EntityController from 'src/common/classes/entity-controller';
import type { Users } from 'src/db';
import UsersApiService from 'src/plugins/users/services/users.service';
import LoggerService from 'src/common/services/logger.service';
import { injectable } from 'tsyringe';
import type { Application, Router } from 'express';
import { CreateUserRequest } from 'src/plugins/users/types/api';
import { SuccessResponse } from 'src/common/classes/api-controller';
import MiddlewaresService from 'src/common/services/middlewares.service';
import { CreateUserSchema } from 'src/plugins/users/schemas';
import { IdSchema } from 'src/common/schemas';

@injectable()
export default class UsersController extends EntityController<Users> {
    protected override basePath: string = '/users';

    constructor(
        _service: UsersApiService,
        _logger: LoggerService,
        private readonly _middlewares: MiddlewaresService
    ) {
        super(_service, _logger);
    }

    override register(app: Application | Router): void {
        this.router.get(
            '/:id',
            this.middleware(this._middlewares.validateParams(IdSchema)),
            this.apiMethod(this.getOne)
        );
        this.router.post(
            '/',
            this.middleware(this._middlewares.validateBody(CreateUserSchema)),
            this.apiMethod(this.createOne)
        );
        this.router.put(
            '/:id',
            this.middleware(this._middlewares.validateParams(IdSchema)),
            this.apiMethod(this.updateOne)
        );
        this.router.delete(
            '/:id',
            this.middleware(this._middlewares.validateParams(IdSchema)),
            this.apiMethod(this.deleteOne)
        );

        super.register(app);
    }

    protected override async createOne(request: CreateUserRequest): Promise<SuccessResponse<Users>> {
        const user = await this.service.createOne(request.body);

        return this.toSuccessResponse(user, 'Entity created');
    }
}