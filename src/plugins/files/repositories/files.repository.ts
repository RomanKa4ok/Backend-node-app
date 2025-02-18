import { injectable } from 'tsyringe';
import RepositoryEntity from 'src/common/classes/entity-repository';
import{ Files } from 'src/db/entities'
import type { EntityTarget } from 'typeorm';

injectable()

export default class FilesRepository extends RepositoryEntity<Files> {
    override model: EntityTarget<Files> = Files;
    override alias = 'files';
}