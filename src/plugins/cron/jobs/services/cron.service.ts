import JobsBase from 'src/common/classes/jobs-base';
import { singleton } from 'tsyringe';
import LoggerService from 'src/common/services/logger.service';
import { HeartbeatJob } from 'src/plugins/cron/jobs'

@singleton()
export default class CronJobService {
    private readonly _cronJobs: JobsBase[];

    constructor(
        private readonly _logger: LoggerService,
        heartbeatJob: HeartbeatJob,
        )
    {
        this._cronJobs = [heartbeatJob]
    }

    start() {
        this._logger.info('Starting all jobs');
        this._cronJobs.forEach(job => job.start());
    }

    getJobs() {
        return this._cronJobs;
    }
}