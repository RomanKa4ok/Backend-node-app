import EntityService from 'src/common/classes/entity-service';
import type { Articles } from 'src/db';
import ArticlesRepository from '../repositories/articles.repository';
import { injectable } from 'tsyringe';

@injectable()
export default class ArticlesService extends EntityService<Articles> {
    constructor(repository: ArticlesRepository) {
        super(repository);
    }
}