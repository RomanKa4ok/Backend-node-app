import { FileUploadProviderBase } from 'src/common/services/file-upload';
import type { UploadFileOptions, UploadFileResult } from 'src/common/services/file-upload/upload.provider.base';
import { mkdir, access, constants, writeFile } from 'fs/promises';
import type LoggerService from 'src/common/services/logger.service';
import { join } from 'path';
import * as process from 'node:process';
import { generateRandomString } from 'src/common/helpers/string.helper';

export default class LocalUploadProvider extends FileUploadProviderBase {
    private readonly _fileFolder: string;

    constructor(logger: LoggerService) {
        super(logger);

        this._fileFolder = join(process.cwd(), '.uploads');
    }

    override async init(): Promise<void> {
        this.logger.info('Initializing local upload provider');

        try {
            await access(this._fileFolder, constants.R_OK | constants.W_OK);

        } catch (error) {
            if (error.code === 'ENOENT') {
                await mkdir(this._fileFolder, { recursive: true });
            } else {
                this.logger.error(error);
            }
        }
    }

    override async uploadFile(file: Buffer, options: UploadFileOptions): Promise<UploadFileResult> {
        const fileName = options.fileName || generateRandomString(30);
        const fullName = `${fileName}.${options.format}`;
        const filePath = join(this._fileFolder, fullName);

        await writeFile(filePath, new Uint8Array(file));

        return {
            fileName,
            filePath,
            fullName
        }
    }
}