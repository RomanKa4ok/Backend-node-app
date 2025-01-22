import { pgdb } from 'src/db/typeorm';
import type { EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export default abstract class RepositoryBase<Entity extends ObjectLiteral> {
    abstract model: EntityTarget<Entity>;
    abstract alias: string;

    async findOneBy(where: Partial<Entity>): Promise<Entity | null> {
        return await this.getRepository().findOneBy(where);
    }

    async findOneByOrFail(where: Partial<Entity>): Promise<Entity> {
        return await this.getRepository().findOneByOrFail(where);
    }

    async updateOneBy(where: Partial<Entity>, data: Partial<Entity>): Promise<Entity> {
        await this.getRepository().update(where, data);

        return await this.findOneByOrFail(where);
    }

    async createOne(data: Partial<Entity>): Promise<Entity> {
        const { generatedMaps } = await this.getRepository().insert(data);

        return generatedMaps[0] as Entity;
    }

    async deleteOneBy(where: Partial<Entity>) {
        return await this.getRepository().delete(where);
    }


    protected getRepository(): Repository<Entity> {
        return pgdb.getRepository(this.model);
    }
}