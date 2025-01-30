import type { TAny } from 'src/common/types';
import * as Transport from 'winston-transport';
import LogsModel from 'src/db/models/log.model';

export default class MongoTransport extends Transport {
    private readonly _stack: TAny[] = [];
    private readonly _maxSize: number = 10;

    public override log(info: TAny, next: () => void) {
        setImmediate(() => {
            this.emit('logged', info)
        })

        const { message, level, ...payload } = info
        this._stack.push({
            message,
            level,
            payload,
        })

        if (this._stack.length >= this._maxSize) {
            this._saveLogs()
        }

        next();
    }

    _saveLogs(): void {
        LogsModel.insertMany(this._stack);
        this._stack.splice(0, this._stack.length);
    }
}