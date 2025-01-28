import { inject, injectable } from 'tsyringe';
import { Logger } from 'winston';

import '../../libs/winston'
import { TAny } from 'src/common/types';

@injectable()
export default class LoggerService {
    constructor(@inject(Logger) private readonly _logger: Logger) {}

    info(message: string, ...meta: TAny[]): void {
        this._logger.info(message, ...meta);
    }

    error(message: string, ...meta: TAny[]): void {
        this._logger.error(message, ...meta);
    }

    warn(message: string, ...meta: TAny[]): void {
        this._logger.warn(message, ...meta);
    }

    debug(message: string, ...meta: TAny[]): void {
        this._logger.debug(message, ...meta);
    }

    createChild(module: string): LoggerService {
        return new LoggerService(this._logger.child(module));
    }
}