import UsersRepository from 'src/plugins/users/repositories/users.repository';
import LoggerService from 'src/common/services/logger.service';
import { ApiError, NotFoundError } from 'src/common/classes/errors';
import PasswordsService from 'src/plugins/users/services/passwords.service';
import JwtService from 'src/common/services/jwt.service';
import { singleton } from 'tsyringe';
import { EventEmitter } from 'events';

export type SignInData = {
    email: string;
    password: string;
}

export type UserSignedInData = {
    userId: string;
}

@singleton()
export default class SignInService extends EventEmitter {
    public static EVENT_USER_SIGNED_IN = 'user_signed_in';
    private readonly _logger: LoggerService;

    constructor(
        logger: LoggerService,
        private readonly _usersRepository: UsersRepository,
        private readonly _JWTService: JwtService,
        private readonly _passwordService: PasswordsService,
    ) {
        super();
        this._logger = logger.createChild('SignImService');
    }

    async signIn(data: SignInData) {
        this._logger.info(`Trying to log in: ${data.email}`);

        const user = await this._usersRepository.getUserForSignIn(data.email);

        if (!user) {
            this._logger.error(`User not found: ${data.email}`);

            throw new NotFoundError('User does not exist');
        }

        if (!user.emailConfirmedAt) {
            this._logger.error(`User not confirmed: ${data.email}`);

            throw new ApiError('User has to confirm email to be able to authorize');
        }

        if (!this._passwordService.comparePassword(data.password, user.salt, user.password)) {
            this._logger.error(`Incorrect password for: ${data.email}`);

            throw new ApiError('User with provided email and password is invalid');
        }

        this._logger.info(`Logged in successfully: ${data.email}`);

        const token = this._JWTService.generateToken({ id: user.id }, '1Day')

        this.emit(SignInService.EVENT_USER_SIGNED_IN, { userId: user.id });

        return { token };
    }
}