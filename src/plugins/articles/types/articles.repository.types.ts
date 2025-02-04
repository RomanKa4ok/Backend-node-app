import type { GetListPagedQuery } from 'src/common/types';

export type GetArticlesPagedQuery = GetListPagedQuery & {
    createdById?: string;
}