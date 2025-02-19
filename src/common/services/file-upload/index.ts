import FileUploadProviderBase from 'src/common/services/file-upload/upload.provider.base';
import LoggerService from 'src/common/services/logger.service';
import config from 'src/config'
import { FileUploadProvider } from 'src/common/constants';
import LocalUploadProvider from 'src/common/services/file-upload/upload.provider.local';
import { singleton } from 'tsyringe';

@singleton()
export default class FileUpload {
    private readonly _uploadProvider: FileUploadProviderBase;

    constructor(logger: LoggerService) {
        switch(config.FILE_UPLOAD_PROVIDER) {
            case FileUploadProvider.Local:
                this._uploadProvider = new LocalUploadProvider(logger);
                break;
        }
    }

    init() {
        return this._uploadProvider.init()
    }

    uploadFile(...args: Parameters<FileUploadProviderBase['uploadFile']>) {
        return this._uploadProvider.uploadFile(...args);
    }
}

export { FileUploadProviderBase };