import { injectable } from 'tsyringe';
import ApiController from 'src/common/classes/api-controller';
import SignUpService from 'src/plugins/auth/services/sign-up.service';
import { ConfirmEmailRequest, SignInUserRequest, SignUpUserRequest } from 'src/plugins/auth/types/api';
import LoggerService from 'src/common/services/logger.service';
import SignInService from 'src/plugins/auth/services/sign-in.service';
import EmailConfirmationService from 'src/plugins/auth/services/email-confirmation.service';

@injectable()
export default class AuthController extends ApiController {
    constructor(
        logger: LoggerService,
        private readonly _signUpService: SignUpService,
        private readonly _signInService: SignInService,
        private readonly _emailConfirmationService: EmailConfirmationService,
    ) {
        super(logger);
    }

    override register() {
        this.post('/sign-up', this.signUp)
        this.post('/sign-in', this.signIn)
        this.get('/email-confirmation', this.confirmEmail)

        return super.register();
    }

    protected async signUp(req: SignUpUserRequest) {
        const user = await this._signUpService.signUp(req.body);

        return this.toSuccessResponse(user, 'User signed up successfully!')
    }

    protected async signIn(req: SignInUserRequest) {
        const data = await this._signInService.signIn(req.body);

        return this.toSuccessResponse(data, 'User logged in to the system!');
    }

    protected async confirmEmail(req: ConfirmEmailRequest) {
        await this._emailConfirmationService.confirmEmail(req.query.token, req.query.email);

        return this.toSuccessResponse({}, 'Email confirmed successfully!');
    }
}