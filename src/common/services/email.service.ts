import { injectable } from 'tsyringe';
import LoggerService from 'src/common/services/logger.service';
import { MailgunMessageData } from 'mailgun.js';
import mg from '../../libs/mailgun'
import config from 'src/config';

const { MAILGUN_DOMAIN, MAILGUN_EMAIL_FROM } = config;

@injectable()
export default class EmailService {
    private readonly _logger: LoggerService;

    constructor(_logger: LoggerService) {
        this._logger = _logger.createChild('EmailService');
    }

    async sendEmail(params: MailgunMessageData): Promise<void> {
        try {
            this._logger.info('Sending email to mailgun');
            await mg.messages.create(MAILGUN_DOMAIN, {
                template: params.template as string,
                ...params,
                from: params.from || MAILGUN_EMAIL_FROM
            })
        } catch (error) {
            this._logger.error(error);
        }
    }
}