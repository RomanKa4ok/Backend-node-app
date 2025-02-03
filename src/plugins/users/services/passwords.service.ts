import { injectable } from 'tsyringe';
import { randomBytes, pbkdf2Sync } from 'crypto'

@injectable()
export default class PasswordsService {
    generatePassword(password: string) {
        const salt = randomBytes(16).toString('hex');
        const hashedPassword = this.generateHashedPass(password, salt);

        return { salt, hashedPassword }
    }

    comparePassword(raw: string, salt: string, hashedPassword: string): boolean {
        const rawHashed = this.generateHashedPass(raw, salt);

        return rawHashed === hashedPassword;
    }

    generateHashedPass(password: string, salt: string): string {
        return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    }
}