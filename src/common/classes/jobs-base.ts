import { CronJob } from 'cron';
import type LoggerService from 'src/common/services/logger.service';

export default abstract class JobsBase {
    protected readonly _logger: LoggerService;
    protected abstract cronTime: string;
    runOnStart = true;

    private _Job: CronJob;

    constructor(logger: LoggerService) {
        this._logger = logger.createChild(this.constructor.name);
    }

    protected abstract onTick(): Promise<void>;

    start() {
        this._logger.info('Starting jobs');
        this._Job = CronJob.from(this.buildConfig());
        this._Job.start();
    }

    stop() {
        this._logger.info('Stopping jobs');
        this._Job.stop();
    }

    getJobName() {
        return this.constructor.name;
    }

    isRunning(){
        return this._Job.isCallbackRunning;
    }

    protected async onTickWrapper() {
        const start = Date.now();

        try {
            this._logger.info('Job started');
            await this.onTick();
        } catch (error) {
            this._logger.error(error)
        } finally {
            this._logger.info(`Cron job finished: Execution time ${Date.now() - start}ms`);
        }
    }

    protected buildConfig() {
        return {
            cronTime: this.cronTime,
            onTick: this.onTickWrapper.bind(this)
        }
    }
}