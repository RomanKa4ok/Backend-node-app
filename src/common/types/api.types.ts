import type { EmptyObject } from 'src/common/types/index';
import type { Request } from 'express';

export type ResponseStatus = 'success' | 'error';
export type ApiRequest<
    P = EmptyObject,
    ReqBody = EmptyObject,
    ReqQuery = EmptyObject,
> = Request<P, EmptyObject, ReqBody, ReqQuery>

export type GetOneRequest = ApiRequest<{ id: string}>
export type CreateOneRequest<T> = ApiRequest<EmptyObject, T>
export type UpdateOneRequest<T> = ApiRequest<{ id: string }, T>
export type DeleteOneRequest = ApiRequest<{ id: string }>