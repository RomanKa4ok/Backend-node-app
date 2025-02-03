// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TAny = any;
export type EmptyObject = Record<string, never>
export type GetListPagedQuery = {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}
export type GetListPagedQueryBuilderQuery = Required<Pick<GetListPagedQuery, 'page' | 'pageSize'>> & Partial<GetListPagedQuery>

export type GetListPagedReturn<Entity> = {
    result: Entity[];
    total: number;
    page: number;
    pageSize: number;
}