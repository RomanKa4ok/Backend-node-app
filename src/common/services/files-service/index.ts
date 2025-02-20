import FilesProviderBase from 'src/common/services/files-service/files.provider.base';
import LoggerService from 'src/common/services/logger.service';
import config from 'src/config'
import { FileUploadProvider } from 'src/common/constants';
import LocalUploadProvider from 'src/common/services/files-service/files.provider.local';
import { singleton } from 'tsyringe';
import S3UploadProvider from 'src/common/services/files-service/files.provider.s3';
import AWSS3Service from 'src/libs/aws';

@singleton()
export default class FilesService {
    private readonly _filesProvider: FilesProviderBase;

    constructor(logger: LoggerService, awsService: AWSS3Service) {
        switch(config.FILE_UPLOAD_PROVIDER) {
            case FileUploadProvider.Local:
                this._filesProvider = new LocalUploadProvider(logger);
                break;
            case FileUploadProvider.S3:
                this._filesProvider = new S3UploadProvider(logger, awsService);
                break;
        }
    }

    init() {
        return this._filesProvider.init()
    }

    uploadFile(...args: Parameters<FilesProviderBase['uploadFile']>) {
        return this._filesProvider.uploadFile(...args);
    }

    getFile(...args: Parameters<FilesProviderBase['getFile']>) {
        return this._filesProvider.getFile(...args);
    }
}

export { FilesService };