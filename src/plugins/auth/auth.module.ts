import { singleton } from 'tsyringe';
import AuthEmailService from 'src/plugins/auth/services/auth-email.service';
import { Observer } from 'src/common/types/observer';
import UserCacheService from 'src/plugins/auth/services/users-cache.service';

@singleton()
export default class AuthModule {
    private readonly _observers: Observer[];

    constructor(
        _authEmails: AuthEmailService,
        _userCacheService: UserCacheService,
    ) {
        this._observers = [
            _authEmails,
            _userCacheService
        ];
    }

    load() {
        this._observers.forEach(observer => observer.load());
    }
    unload() {
        this._observers.forEach(observer => observer.unload());
    }
}