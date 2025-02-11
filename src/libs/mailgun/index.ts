import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import config from 'src/config';

const mailgun = new Mailgun(FormData);
const { MAILGUN_API_KEY } = config;

const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });

export type MailgunType = typeof mg;

export default mg;