import UsersRepository from 'src/plugins/users/repositories/users.repository';
import { injectable } from 'tsyringe';
import { UserRoles } from 'src/db/entities/Users';
import PasswordsService from 'src/plugins/users/services/passwords.service';
import { EntityStatus } from 'src/common/constants';
import LoggerService from 'src/common/services/logger.service';

export type SignUpData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

@injectable()
export default class SignUpService {
    private readonly _logger: LoggerService;

    constructor(
        logger: LoggerService,
        private readonly _passwordsService: PasswordsService,
        private readonly _usersRepository: UsersRepository
) {
        this._logger = logger.createChild('SignUpService');
    }
    signUp(data: SignUpData) {
        this._logger.info(`Signing user ${data.email}`);

        const { salt, hashedPassword } = this._passwordsService.generatePassword(data.password);

        const user = this._usersRepository.createOne({
            ...data,
            salt,
            password: hashedPassword,
            role: UserRoles.USER,
            entityStatus: EntityStatus.Active,
        })

        this._logger.info(`${data.email}: Signed up successfully!`);

        return user;
    }
}