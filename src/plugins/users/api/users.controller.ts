import EntityController from 'src/common/classes/entity-controller';
import type { Users } from 'src/db';
import UsersApiService from 'src/plugins/users/services/users.service';
import LoggerService from 'src/common/services/logger.service';
import { injectable } from 'tsyringe';
import type { Application, Router } from 'express';
import { CreateUserRequest, CreateUserRequestBody } from 'src/plugins/users/types/api';
import { SuccessResponse } from 'src/common/classes/api-controller';
import { pick } from 'lodash';


@injectable()
export default class UsersController extends EntityController<Users> {
    protected override basePath: string = '/users';

    constructor(_service: UsersApiService, _logger: LoggerService) {
        super(_service, _logger);
    }

    override register(app: Application | Router): void {
        this.router.get(
            '/:id',
            this.apiMethod(this.getOne)
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

    protected override async createOne(request: CreateUserRequest): Promise<SuccessResponse<Users>> {
        const data = pick(
            request.body,
            ['email', 'password', 'firstName', 'lastName'] as (keyof CreateUserRequestBody)[]
        )

        const user = await this.service.createOne(data);

        return this.toSuccessResponse(user, 'Entity created');
    }
}