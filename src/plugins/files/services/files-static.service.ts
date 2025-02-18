import type { Files } from 'src/db/entities';
import { injectable } from 'tsyringe';
import FilesRepository from 'src/plugins/files/repositories/files.repository';
import { NotFoundError } from 'src/common/classes/errors';
import LoggerService from 'src/common/services/logger.service';
import { createReadStream, type ReadStream } from 'fs';

type GetFileStreamByIdParams = {
    id: string;
    w?: string;
}

@injectable()
export default class FilesStaticService {
    constructor(
        private readonly _logger: LoggerService,
        private readonly _filesRepository: FilesRepository
    ) {
        this._logger = _logger.createChild('FilesStaticService');
    }

    async getFileStreamById(params: GetFileStreamByIdParams): Promise<{ file: Files, stream: ReadStream }> {
        const { id, w } = params;
        const width = w ? parseInt(w) : null;
        const file = await this._filesRepository.findImageBySize(id, width);

        if (!file) {
            this._logger.error(`No file with id ${id}`);
            throw new NotFoundError(`File with id ${id} not found`);
        }

        const stream = createReadStream(file.path);

        return { file, stream };
    }
}
