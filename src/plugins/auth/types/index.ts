import type { Users } from 'src/db';

export  * from './api';

export type AuthorizedUser = Pick<Users, 'id' | 'email' | 'role' | 'firstName' | 'lastName' >;









