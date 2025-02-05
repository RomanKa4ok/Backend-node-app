import { injectable } from 'tsyringe';
import ApiController from 'src/common/classes/api-controller';
import SignUpService from 'src/plugins/auth/services/users.service';
import { SignUpUserRequest } from 'src/plugins/auth/types/api';
import LoggerService from 'src/common/services/logger.service';

@injectable()
export default class AuthController extends ApiController {
    constructor(
        logger: LoggerService,
        private readonly _signUpService: SignUpService
    ) {
        super(logger);
    }

    override register() {
        this.post('/sign-up', this.signUp)

        return super.register();
    }

    protected async signUp(req: SignUpUserRequest) {
        const user = await this._signUpService.signUp(req.body);

        return this.toSuccessResponse(user, 'User signed up successfully!')
    }
}