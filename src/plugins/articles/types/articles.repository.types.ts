import type { GetListPagedQuery } from 'src/common/types';

export type GetArticlesPagedQueryBuilderResult = GetListPagedQuery & {
    createdById: string;
}