import { pgdb } from 'src/db/typeorm';
import type { EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import type { GetListPagedQuery, GetListPagedQueryBuilderQuery, GetListPagedReturn } from 'src/common/types';

export default abstract class RepositoryBase<Entity extends ObjectLiteral> {
    abstract model: EntityTarget<Entity>;
    abstract alias: string;

    async findOneBy(where: Partial<Entity>): Promise<Entity | null> {
        return await this.getRepository().findOneBy(where);
    }

    async findOneByOrFail(where: Partial<Entity>): Promise<Entity> {
        return await this.getRepository().findOneByOrFail(where);
    }

    async getListPaged(query: GetListPagedQuery): Promise<GetListPagedReturn<Entity>> {
        const { page = 1, pageSize = 1000 } = query;

        const qb = this.getListPagedQueryBuilder({ page, pageSize });

        const [result, total] = await qb.getManyAndCount();

        return this.toListPagedResponse(result, page, pageSize, total);
    }

    async updateOneBy(where: Partial<Entity>, data: Partial<Entity>): Promise<Entity> {
        await this.getRepository().update(where, data);

        return await this.findOneByOrFail(where);
    }

    async createOne(data: Partial<Entity>): Promise<Entity> {
        const { generatedMaps } = await this.getQueryBuilder()
            .insert()
            .values(data)
            .returning('*')
            .execute();

        return generatedMaps[0] as Entity;
    }

    async deleteOneBy(where: Partial<Entity>) {
        return await this.getRepository().delete(where);
    }


    protected getRepository(): Repository<Entity> {
        return pgdb.getRepository(this.model);
    }

    protected getQueryBuilder() {
        return this.getRepository().createQueryBuilder(this.alias);
    }

    protected getListPagedQueryBuilder(query: GetListPagedQueryBuilderQuery) {
        const { page, pageSize, sortBy, sortDirection } = query;

        const qb =  this.getQueryBuilder()
            .skip((page - 1) * pageSize)
            .take(pageSize);

        if (sortBy) {
            qb.orderBy(sortBy, sortDirection);
        }

        return qb;
    }

    protected toListPagedResponse(result: Entity[], total: number, page: number, pageSize: number) {
        return {
            result,
            total,
            page,
            pageSize
        }
    }
}