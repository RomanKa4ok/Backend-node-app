import { EntityStatus } from '../constants';
import type EntityBase from './entity-base';
import RepositoryBase from './repository';

export default abstract class RepositoryEntity<Entity extends EntityBase> extends RepositoryBase<Entity> {
    async softDeleteOneBy(where: Partial<Entity>) {
        const data = {
            entityStatus: EntityStatus.Deleted
        } as Partial<Entity>;

        return await this.updateOneBy(where, data);
    }
}