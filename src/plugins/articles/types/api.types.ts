import type { CreateOneRequest } from 'src/common/types/api.types';

export type CreateOneArticlesRequestBody = {
    title: string;
    content: string;
    createdById: string;
}

export type CreateOneArticlesRequest = CreateOneRequest<CreateOneArticlesRequestBody>