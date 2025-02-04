import type { CreateUserRequestBody } from 'src/plugins/users/types/api';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export default class CreateUserSchema implements CreateUserRequestBody {
    @IsString()
    @MaxLength(20)
    firstName: string;

    @IsString()
    @MaxLength(20)
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    constructor(data: CreateUserRequestBody) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.password = data.password;
    }
}