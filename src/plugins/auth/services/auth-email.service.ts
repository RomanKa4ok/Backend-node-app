import EmailService from 'src/common/services/email.service';
import config from 'src/config'
import { injectable } from 'tsyringe';
import { Observer } from 'src/common/types/observer';
import SignUpService, { SignUpEventData } from 'src/plugins/auth/services/sign-up.service';
import LoggerService from 'src/common/services/logger.service';

const { APP_URL } = config;

@injectable()
export default class AuthEmailService implements Observer {
    private readonly _logger: LoggerService;

    constructor(
        private readonly _emailService: EmailService,
        private readonly _signUpService: SignUpService,
        _logger: LoggerService,
    ) {
        this._logger = _logger.createChild('AuthEmailService');
    }

    load() {
        this._signUpService.on(SignUpService.EVENT_USER_SIGNED_UP, this.sendConfirmationEmail.bind(this));
    }

    unload() {
        this._signUpService.off(SignUpService.EVENT_USER_SIGNED_UP, this.sendConfirmationEmail.bind(this))
    }

    sendConfirmationEmail = async ({ user }: SignUpEventData) => {
        const { email, emailConfirmationToken } = user;

        this._logger.info(`Sending confirmation email to ${email}`);

        const url = `${APP_URL}/api/auth/email-confirmation?token${emailConfirmationToken}&email=${email}`;

        this._emailService.sendEmail({
            to: email,
            subject: 'Confirm your email',
            html: `
                <h1>Confirm your email</h1>
                <p>Click <a href='${url}'>here</a></p>
                <p>Or use the following token: ${emailConfirmationToken}</p>`,
        })
    }
}