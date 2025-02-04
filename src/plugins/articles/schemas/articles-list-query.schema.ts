import { ListQuerySchema } from 'src/common/schemas';
import type { GetArticlesPagedQuery } from 'src/plugins/articles/types/articles.repository.types';
import { IsOptional, IsString } from 'class-validator';

export default class ArticlesListQuerySchema extends ListQuerySchema implements GetArticlesPagedQuery{
    @IsOptional()
    @IsString()

    createdById?: string;

    constructor(data: GetArticlesPagedQuery) {
        super(data);

        this.createdById = data.createdById;
    }
}