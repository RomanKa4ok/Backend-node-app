import { singleton } from 'tsyringe';
import AuthEmailService from 'src/plugins/auth/services/auth-email.service';
import { Observer } from 'src/common/types/observer';

@singleton()
export default class AuthModule {
    private readonly _observers: Observer[];

    constructor(_authEmails: AuthEmailService) {
        this._observers = [_authEmails];
    }

    load() {
        this._observers.forEach(observer => observer.load());
    }
    unload() {
        this._observers.forEach(observer => observer.unload());
    }
}