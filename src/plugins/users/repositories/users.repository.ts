import RepositoryEntity from 'src/common/classes/entity-repository';
import { Users } from 'src/db';
import { injectable } from 'tsyringe';
import { omit } from 'lodash';
import { AuthorizedUser, AuthUserCache } from 'src/plugins/auth/types';
import { EntityStatus } from 'src/common/constants';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@injectable()
export default class UsersRepository extends RepositoryEntity<Users> {
    override model = Users;
    override alias = 'users'

    override findOneBy(where: FindOptionsWhere<Users>): Promise<Users | null> {
        return this.getRepository().findOne({
            where,
            relations: {
                avatar: true
            },

        });
    }

    override async createOne(data: Partial<Users>): Promise<Users> {
        const user = await super.createOne({
            ...data,
        });

        return omit(user, ['password', 'salt', 'emailConfirmedAt'] as (keyof Users)[]) as Users;
    }

    getUserForCache(id: string): Promise<AuthUserCache> {
        return this.getRepository().findOne({ where: { id } }) as Promise<AuthUserCache>;
    }

    getAuthUser(id: string): Promise<AuthorizedUser> {
        return this.getRepository().findOneBy({ id, entityStatus: EntityStatus.Active }) as Promise<AuthorizedUser>;
    }

    async getUserForSignIn(email: string) {
        return await this.getRepository().findOne({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                salt: true,
                emailConfirmedAt: true,
            }
        })
    }
}