import type EntityBase from './entity-base';
import type RepositoryEntity from './entity-repository';
import type { GetListPagedQuery, GetListPagedReturn } from 'src/common/types';

export default abstract class EntityService<Entity extends EntityBase> {
    protected repository: RepositoryEntity<Entity>;

    constructor(repository: RepositoryEntity<Entity>) {
        this.repository = repository;
    }

    async findOneBy(where: Partial<Entity>): Promise<Entity> {
        return await this.repository.findOneByOrFail(where);
    }

    async getListPaged(query: GetListPagedQuery): Promise<GetListPagedReturn<Entity>> {
        return await this.repository.getListPaged(query);
    }

    async createOne(data: Partial<Entity>): Promise<Entity> {
        return await this.repository.createOne(data);
    }

    async updateOneBy(where: Partial<Entity>, data: Partial<Entity>): Promise<Entity> {
        return await this.repository.updateOneBy(
            where,
            data
        );
    }

    async softDeleteOneBy(where: Partial<Entity>) {
        return await this.repository.softDeleteOneBy(where);
    }
}