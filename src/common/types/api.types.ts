import type { EmptyObject, GetListPagedQuery } from 'src/common/types/index';
import type { Request } from 'express';
import type { AuthorizedUser } from 'src/plugins/auth/types';

export type ResponseStatus = 'success' | 'error';
export type ApiRequest<
    P = EmptyObject,
    ReqBody = EmptyObject,
    ReqQuery = EmptyObject,
> = Request<P, EmptyObject, ReqBody, ReqQuery>

export type AuthRequest<
    P = EmptyObject,
    ReqBody = EmptyObject,
    ReqQuery = EmptyObject,
> = ApiRequest<P, ReqBody, ReqQuery> & { user: AuthorizedUser }
export type GetOneRequest = ApiRequest<{ id: string}>
export type GetListPagedRequest = ApiRequest<EmptyObject, EmptyObject, GetListPagedQuery>
export type CreateOneRequest<T> = ApiRequest<EmptyObject, T>
export type UpdateOneRequest<T> = ApiRequest<{ id: string }, T>
export type DeleteOneRequest = ApiRequest<{ id: string }>