import UsersRepository from 'src/plugins/users/repositories/users.repository';
import { injectable } from 'tsyringe';
import LoggerService from 'src/common/services/logger.service';
import { ApiError } from 'src/common/classes/errors';

@injectable()
export default class EmailConfirmationService {
    constructor(
        private readonly _logger: LoggerService,
        private readonly _usersRepository: UsersRepository
) {
    this._logger = _logger.createChild('EmailConfirmationService');
    }

    async confirmEmail(token: string, email: string) {
        const user = await this._usersRepository.findOneBy({ email, emailConfirmationToken: token });

        if (!user) {
            this._logger.error(`Token ${token} is invalid`);
            throw new ApiError('Invalid token');
        }

        await this._usersRepository.updateOneBy({ id: user.id }, {
            emailConfirmedAt: new Date(),
        })
    }
}