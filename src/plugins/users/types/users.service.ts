export type CreateOneUserData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export type UpdateOneUserData =  {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}