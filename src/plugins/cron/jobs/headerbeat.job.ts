import LoggerService from 'src/common/services/logger.service';
import { singleton } from 'tsyringe';
import JobsBase from 'src/common/classes/jobs-base';

@singleton()
export default class HeartbeatJob extends JobsBase {
    cronTime = '* * * * * *'; // Every second

    constructor(logger: LoggerService) {
        super(logger)
    }

    override async onTick() {
        this._logger.info('You will see this message every secind');
    }
}