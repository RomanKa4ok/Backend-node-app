import { EntityStatus } from '../constants';
import { randomUUID } from 'node:crypto';
import type EntityBase from './entity-base';
import RepositoryBase from './repository';

export default abstract class RepositoryEntity<Entity extends EntityBase> extends RepositoryBase<Entity> {
    override createOne(data: Partial<Entity>) {
        return super.createOne({
            id: randomUUID(),
            entityStatus: EntityStatus.Draft,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data
        });
    }

    override updateOneBy(where: Partial<Entity>, data: Partial<Entity>) {
        return super.updateOneBy(where, {
            ...data,
            updatedAt: new Date(),
        });
    }

    async softDeleteOneBy(where: Partial<Entity>) {
        const data = {
            entityStatus: EntityStatus.Deleted
        } as Partial<Entity>;

        return await this.updateOneBy(where, data);
    }
}