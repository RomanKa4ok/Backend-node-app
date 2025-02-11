import UsersRepository from 'src/plugins/users/repositories/users.repository';
import { singleton } from 'tsyringe';
import Users, { UserRoles } from 'src/db/entities/Users';
import PasswordsService from 'src/plugins/users/services/passwords.service';
import { EntityStatus } from 'src/common/constants';
import LoggerService from 'src/common/services/logger.service';
import { generateRandomString } from 'src/common/helpers/string.helper';
import { EventEmitter } from 'events';

export type SignUpData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type SignUpEventData = {
    user: Users;
};
@singleton()
export default class SignUpService extends EventEmitter {
    public static readonly EVENT_USER_SIGNED_UP = 'user-sign-up';
    private readonly _logger: LoggerService;

    constructor(
        logger: LoggerService,
        private readonly _passwordsService: PasswordsService,
        private readonly _usersRepository: UsersRepository,
) {
        super();
        this._logger = logger.createChild('SignUpService');
    }
    async signUp(data: SignUpData) {
        this._logger.info(`Signing user ${data.email}`);

        const { salt, hashedPassword } = this._passwordsService.generatePassword(data.password);

        const user = await this._usersRepository.createOne({
            ...data,
            emailConfirmationToken: generateRandomString(30),
            salt,
            password: hashedPassword,
            role: UserRoles.USER,
            entityStatus: EntityStatus.Active,
        })

        this._logger.info(`${data.email}: Signed up successfully!`);

        this.emit(SignUpService.EVENT_USER_SIGNED_UP, { user } as SignUpEventData);

        return user;
    }
}