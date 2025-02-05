import { IsEmail, IsString, MaxLength } from 'class-validator';
import { SignUpUserRequestBody } from 'src/plugins/auth/types/api';

export default class SignUpSchema implements SignUpUserRequestBody {
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

    constructor(data: SignUpUserRequestBody) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.password = data.password;
    }
}