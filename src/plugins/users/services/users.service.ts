import EntityService from 'src/common/classes/entity-service';
import { Users } from 'src/db';
import UsersRepository from 'src/plugins/users/repositories/users.repository';
import { injectable } from 'tsyringe';
import { UserRoles } from 'src/db/entities/Users';
import { CreateOneUserData } from 'src/plugins/users/types/users.service';
import PasswordsService from 'src/plugins/users/services/passwords.service';
import { EntityStatus } from 'src/common/constants';


@injectable()
export default class UsersApiService extends EntityService<Users> {
    constructor(
        repository: UsersRepository,
        private readonly _passwordService: PasswordsService
    ) {
        super(repository);
    }

    override async createOne(data: CreateOneUserData): Promise<Users> {
        const { salt, hashedPassword } = this._passwordService.generatePassword(data.password)

        return await super.createOne({
            ...data,
            salt,
            password: hashedPassword,
            role: UserRoles.USER,
            entityStatus: EntityStatus.Active
        });
    }
}