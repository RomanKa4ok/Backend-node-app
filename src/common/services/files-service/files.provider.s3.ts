import type {
    GetFileResult,
    UploadFileOptions,
    UploadFileResult
} from 'src/common/services/files-service/files.provider.base';
import FilesProviderBase from 'src/common/services/files-service/files.provider.base';
import type LoggerService from 'src/common/services/logger.service';
import type AWSS3Service from 'src/libs/aws';
import { generateRandomString } from 'src/common/helpers/string.helper';
import config from 'src/config';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ApiError } from 'src/common/classes/errors';
import type { Readable } from 'stream';

const { AWS_S3_BUCKET } = config;

export default class S3FilesProvider extends FilesProviderBase {
    private readonly _basePath = 'uploads';

    constructor(
        logger: LoggerService,
        private readonly _awsService: AWSS3Service,
    ) {
        super(logger);
    }

    override async init(): Promise<void> {
        this.logger.info('Initializing S3 upload provider');

        this._awsService.init();
    }

    override async uploadFile(file: Buffer, options: UploadFileOptions): Promise<UploadFileResult> {
        const fileName = options.fileName || generateRandomString(30);
        const fullName = `${fileName}.${options.format}`;
        const key = `${this._basePath}/${fullName}`;

        this.logger.info(`Uploading file to ${key}`);

        const params = {
            Bucket: AWS_S3_BUCKET,
            Key: key,
            Body: file,
        }

        const command = new PutObjectCommand(params);
        await this._awsService.getClient().send(command)

        return {
            filePath: key,
            fullName,
            fileName,
        }
    }

    override async getFile(key: string): Promise<GetFileResult> {
        const params = {
            Bucket: AWS_S3_BUCKET,
            Key: key
        }
        const command = new GetObjectCommand(params);
        const res = await this._awsService.getClient().send(command);

        if (!res.Body) {
            throw new ApiError(`Could not find object with key ${key}`);
        }
        
        return res.Body as Readable;

    }
}