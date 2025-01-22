import RepositoryEntity from 'src/common/classes/entity-repository';
import { Articles } from 'src/db';

export default class ArticlesRepository extends RepositoryEntity<Articles> {
    model = Articles;
    alias = 'articles';
}