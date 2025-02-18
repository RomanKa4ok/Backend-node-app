import EntityController from 'src/common/classes/entity-controller';
import type { Users } from 'src/db';
import UsersApiService from 'src/plugins/users/services/users.service';
import LoggerService from 'src/common/services/logger.service';
import { injectable } from 'tsyringe';
import { CreateUserRequest, UploadAvatarRequest } from 'src/plugins/users/types/api';
import { SuccessResponse } from 'src/common/classes/api-controller';
import MiddlewaresService from 'src/common/services/middlewares.service';
import { CreateUserSchema } from 'src/plugins/users/schemas';
import { IdSchema } from 'src/common/schemas';
import { UpdateOneRequest } from 'src/common/types/api.types';
import UserAvatarService from 'src/plugins/users/services/user-avatar.service';
import { UploadedFile } from 'express-fileupload';
import { TAny } from 'src/common/types';

@injectable()
export default class UsersController extends EntityController<Users> {
    constructor(
        _service: UsersApiService,
        _logger: LoggerService,
        private readonly _middlewares: MiddlewaresService,
        private readonly _userAvatarService: UserAvatarService,
    ) {
        super(_service, _logger);
    }

    override register() {
        this.get(
            '/:id',
            this._middlewares.validateParams(IdSchema),
            this.getOne
        );
        this.get(
            '/',
            this.getListPaged
        );
        this.post(
            '/',
            this._middlewares.validateBody(CreateUserSchema),
            this.createOne
        );
        this.put(
            '/:id',
            this._middlewares.validateParams(IdSchema),
            this.updateOne
        );
        this.delete(
            '/:id',
            this._middlewares.validateParams(IdSchema),
            this.deleteOne
        );
        this.post(
            '/:id/avatar',
            this.uploadAvatar
        );

        return super.register();
    }

    protected async uploadAvatar(request: UploadAvatarRequest): Promise<SuccessResponse<TAny>> {
        await this._userAvatarService.uploadAvatar(request.params.id,  request.files?.file as UploadedFile)

        return this.toSuccessResponse({}, 'Avatar uploaded!')
    }

    protected override async createOne(request: CreateUserRequest): Promise<SuccessResponse<Users>> {
        const user = await this.service.createOne(request.body);

        return this.toSuccessResponse(user, 'Entity created');
    }

    protected override async updateOne(request: UpdateOneRequest<Users>): Promise<SuccessResponse<Users>> {
        const user = await this.service.updateOneBy({ id: request.params.id }, request.body)

        return this.toSuccessResponse(user, 'Entity updated');
    }
}