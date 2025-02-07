import { injectable } from 'tsyringe';
import LoggerService from 'src/common/services/logger.service';
import * as jwt from 'jsonwebtoken';
import config from '../../config'
import { ServerError } from 'src/common/classes/errors';
import { JwtPayload } from 'jsonwebtoken';
import { TAny } from 'src/common/types';
const { JWT_SECRET } = config;

@injectable()
export class JwtService {
    private readonly _logger: LoggerService;

    constructor(logger: LoggerService) {
        this._logger = logger.createChild('JWTService');
    }

    generateToken(data: object, expiresIn: string): string {
        if (!JWT_SECRET) {
            this._logger.error('JWT_SECRET is not defined', data);

            throw new ServerError('JWT_SECRET is not defined');
        }

        return jwt.sign(data, JWT_SECRET, { expiresIn: expiresIn as TAny });
    }

    verifyToken(token: string): string | JwtPayload | null {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            this._logger.error('Failed to verify token', error);

            return null;
        }
    }
}