import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';

@singleton()
export default class UsersServiceEmitter extends EventEmitter {
    public static readonly USER_DATA_UPDATED = 'user_data_updated';

    updateUserCache(userId: string) {
        this.emit(UsersServiceEmitter.USER_DATA_UPDATED, userId);
    }
}