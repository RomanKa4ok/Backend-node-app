import { injectable } from 'tsyringe';
import { NextFunction, Response } from 'express';
import { ApiError } from 'src/common/classes/errors';
import { JwtService } from 'src/common/services/jwt.service';
import { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from 'src/common/types/api.types';
import UserCacheService from 'src/plugins/auth/services/users-cache.service';

@injectable()
export default class AuthMiddlewares {
    constructor(
        private readonly _jwtService: JwtService,
        private readonly _userCacheService: UserCacheService,
    ) {
    }

    async requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
        const token = req.headers.authorization;

        if (!token) {
            throw new ApiError(`Token not found`);
        }

        const jwtToken = token.split(' ')[1];
        const jwtData = this._jwtService.verifyToken(jwtToken) as JwtPayload;

        if (!jwtData) {
            throw new ApiError(`Token is invalid`);
        }

        const user = await this._userCacheService.getAuthUserCache(jwtData.id);

        if (!user) {
            throw new ApiError(`User not found`);
        }

        req.user = user;

        next()
    }
}