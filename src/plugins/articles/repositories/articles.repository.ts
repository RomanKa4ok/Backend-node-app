import RepositoryEntity from 'src/common/classes/entity-repository';
import { Articles } from 'src/db';
import { injectable } from 'tsyringe';
import { GetListPagedReturn } from 'src/common/types';
import { GetArticlesPagedQuery } from 'src/plugins/articles/types/articles.repository.types';
import { EntityStatus } from 'src/common/constants';

@injectable()
export default class ArticlesRepository extends RepositoryEntity<Articles> {
    model = Articles;
    alias = 'articles';

    override async getListPaged(query: GetArticlesPagedQuery): Promise<GetListPagedReturn<Articles>> {
        const { page = 1, pageSize = 1000, createdById, sortBy = 'updatedAt', sortDirection = 'DESC' } = query;
        
        const qb = this.getListPagedQueryBuilder({ page, pageSize, sortBy, sortDirection });

        qb.where('entity_status IN (:...statuses)', { statuses: [EntityStatus.Draft, EntityStatus.Active] });

        if (createdById) {
            qb.andWhere({ createdById: createdById });
        }

        const [result, total] = await qb.getManyAndCount();

        return this.toListPagedResponse(result, total, page, pageSize);
    }
}