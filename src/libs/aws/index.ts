import { singleton } from 'tsyringe';
import LoggerService from 'src/common/services/logger.service';
import config from 'src/config';
import { S3Client } from '@aws-sdk/client-s3';
import { ApiError } from 'src/common/classes/errors';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET } = config;

@singleton()
export default class AWSS3Service {
    private readonly logger: LoggerService;
    private _s3Client: S3Client;

    private _isInitialized: boolean = false

    constructor(logger: LoggerService) {
        this.logger = logger.createChild('AWSS3Service')
    }


    init() {
        if (this._isInitialized) {
            this.logger.info('AWSS3Service already initialized');

            return
        }

        this.logger.info('AWSS3Service initializing...');

        if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET) {
            this.logger.error('AWS environment variable are missing!');
        }

        this._s3Client = new S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            }
        })

        this._isInitialized = true;
        this.logger.info('AWSS3Service initialized successfully!');
    }

    getClient() {
        if (!this._isInitialized) {
            this.logger.error('S3 Client not initialized!');
            throw new ApiError('S3 Client not initialized!');
        }

        return this._s3Client;
    }

}