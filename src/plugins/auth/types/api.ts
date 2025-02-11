import type { ApiRequest } from 'src/common/types/api.types';
import type { EmptyObject } from 'src/common/types';

export type SignUpUserRequestBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type SignInUserRequestBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type ConfirmEmailRequestQuery = {
    token: string;
    email: string;
}

export type SignUpUserRequest = ApiRequest<EmptyObject, SignUpUserRequestBody>
export type SignInUserRequest = ApiRequest<EmptyObject, SignInUserRequestBody>
export type ConfirmEmailRequest = ApiRequest<EmptyObject, EmptyObject, ConfirmEmailRequestQuery>