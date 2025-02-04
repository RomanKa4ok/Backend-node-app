import type { GetListPagedQuery } from 'src/common/types';
import { IsIn, IsOptional, IsString, Min } from 'class-validator';

export class ListQuerySchema implements GetListPagedQuery {
    @IsOptional()
    @Min(1)
    page?: number;

    @Min(1)
    @IsOptional()
    pageSize?: number;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    sortDirection?: 'ASC' | 'DESC';

    constructor(data: GetListPagedQuery) {
        this.page = data.page;
        this.pageSize = data.pageSize;
        this.pageSize = data.pageSize;
        this.sortBy = data.sortBy;
    }
}