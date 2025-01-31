import EntityService from 'src/common/classes/entity-service';
import { Users } from 'src/db';
import UsersRepository from 'src/plugins/users/repositories/users.repository';
import { injectable } from 'tsyringe';
import { UserRoles } from 'src/db/entities/Users';
import { CreateOneUserData } from 'src/plugins/users/types/users.service';


@injectable()
export default class UsersApiService extends EntityService<Users> {
    constructor(repository: UsersRepository) {
        super(repository);
    }

    override async createOne(data: CreateOneUserData): Promise<Users> {
        return await super.createOne({
            ...data,
            role: UserRoles.USER,
        });
    }
}