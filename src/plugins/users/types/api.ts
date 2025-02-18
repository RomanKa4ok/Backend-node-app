import type { AuthRequest, CreateOneRequest } from 'src/common/types/api.types';
import type { CreateUserSchema } from 'src/plugins/users/schemas';

export type CreateUserRequestBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type CreateUserRequest = CreateOneRequest<CreateUserSchema>
export type UploadAvatarRequest = AuthRequest<{ id: string }>