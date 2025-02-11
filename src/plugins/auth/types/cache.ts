import type { UserRoles } from 'src/db/entities/Users';

export type AuthUserCache = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRoles;
}