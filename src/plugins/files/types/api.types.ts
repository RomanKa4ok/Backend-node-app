import type { ApiRequest } from 'src/common/types/api.types';
import type { EmptyObject } from 'src/common/types';

export type GetStaticTypeRequest = ApiRequest<{ id: string }, EmptyObject, { w?: string }>