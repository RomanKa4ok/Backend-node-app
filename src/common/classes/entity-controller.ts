import type { SuccessResponse } from 'src/common/classes/api-controller';
import ApiController from 'src/common/classes/api-controller';
import type EntityBase from 'src/common/classes/entity-base';
import type EntityService from 'src/common/classes/entity-service';
import type { CreateOneRequest, DeleteOneRequest, GetOneRequest, UpdateOneRequest } from 'src/common/types/api.types';
import type { TAny } from 'src/common/types';

export default abstract class EntityController<Entity extends EntityBase> extends ApiController {

    constructor(protected service: EntityService<Entity>) {
        super();
    }

    protected async getOne(request: GetOneRequest): Promise<SuccessResponse<Entity>> {
        const entity = await this.service.findOneBy({
            id: request.params.id
        } as Partial<Entity>);

        return this.toSuccessResponse(
            entity,
            'Entity found'
        );
    }

    protected async createOne(request: CreateOneRequest<Partial<Entity>>): Promise<SuccessResponse<Entity>>{
        const entity = await this.service.createOne(request.body);

        return this.toSuccessResponse(entity, 'Entity created')
    }

    protected async updateOne(request: UpdateOneRequest<TAny>): Promise<SuccessResponse<Entity>> {
        const entity = await this.service.updateOneBy(
            { id: request.params.id } as Partial<Entity>,
            request.body
        );

        return this.toSuccessResponse(entity, 'Entity updated')
    }

    protected async deleteOne(request: DeleteOneRequest): Promise<SuccessResponse> {
        await this.service.softDeleteOneBy({ id: request.params.id } as Partial<Entity>);

        return this.toSuccessResponse({}, 'Entity deleted');
    }
}