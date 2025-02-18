import EntityService from 'src/common/classes/entity-service';
import type { Files } from 'src/db';
import { injectable } from 'tsyringe';
import FilesRepository from 'src/plugins/files/repositories/files.repository';

@injectable()
export default class FilesApiService extends EntityService<Files> {
    constructor(filesRepository: FilesRepository) {
        super(filesRepository);
    }
}