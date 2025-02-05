import RepositoryEntity from 'src/common/classes/entity-repository';
import { Users } from 'src/db';
import { injectable } from 'tsyringe';
import { omit } from 'lodash';

@injectable()
export default class UsersRepository extends RepositoryEntity<Users> {
    override model = Users;
    override alias = 'users'

    override async createOne(data: Partial<Users>): Promise<Users> {
        const user = await super.createOne({
            ...data,
        });

        return omit(user, ['password', 'salt'] as (keyof Users)[]) as Users;
    }

    async getUserForSignIn(email: string) {
        return await this.getRepository().findOne({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                salt: true,
            }
        })
    }
}