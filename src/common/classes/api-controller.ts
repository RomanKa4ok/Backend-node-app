import { Router } from 'express';
import type { Response, Request, NextFunction } from 'express';
import type { ApiRequest, ResponseStatus } from 'src/common/types/api.types';
import type { TAny } from 'src/common/types';
import type LoggerService from 'src/common/services/logger.service';

import 'src/common/services/logger.service'
import { ErrorStatusCode } from 'src/common/constants';
import { ApiError, ApiValidationError, NotFoundError } from 'src/common/classes/errors';
import { EntityNotFoundError } from 'typeorm';

export type SuccessResponse<T extends (object | object[]) = object> = {
    data: T,
    status: ResponseStatus,
    message?: string;
}
type ErrorResponse = {
    status: ResponseStatus,
    message: string;
    statusCode: string;
    data: unknown;
    apiStatusCode: number;
}

type Method<T extends SuccessResponse | never = SuccessResponse> = (
    req: ApiRequest<TAny, TAny, TAny>,
    res: Response
) => Promise<T>

type MiddlewareMethod = (
    req: ApiRequest<TAny, TAny, TAny>,
    res: Response,
    next: NextFunction,
) => Promise<void>

export default abstract class ApiController {
    protected router: Router;
    protected logger: LoggerService;

    protected constructor(logger: LoggerService) {
        this.router = Router();
        this.logger = logger.createChild(this.constructor.name);
    }

    register() {
        return this.router;
    }

    protected middleware(method: MiddlewareMethod) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await method.call(this, req as ApiRequest<TAny, TAny, TAny>, res, next);
            } catch (error) {
                this.logger.error(error.message, error);

                const { apiStatusCode, ...rest } = this.toErrorResponse(error);

                res.status(apiStatusCode).json(rest);
            }
        }
    }

    protected apiMethod(method: Method) {
        return async (req: Request, res: Response) => {
            try {
                const result = await method.call(
                    this,
                    req,
                    res
                );

                res.status(200).json(result);
            } catch (error) {
                this.logger.error(error.message, error);

                const { apiStatusCode, ...rest } = this.toErrorResponse(error);

                res.status(apiStatusCode).json(rest);
            }

            return this.router;
        }
    }

    protected toErrorResponse(error: unknown): ErrorResponse {
        if (!(error instanceof Error)) {
            return {
                status: 'error',
                message: 'Internal Server Error',
                statusCode: ErrorStatusCode.InternalServerError,
                apiStatusCode: 500,
                data: {}
            }
        }

        let message = 'Internal Server Error';
        let statusCode = ErrorStatusCode.InternalServerError;
        let apiStatusCode = 500;
        let data: unknown = {};

        switch (error.constructor) {
            case ApiValidationError:
                message = error.message;
                statusCode = ErrorStatusCode.ValidationError;
                apiStatusCode = 400;
                data = (error as ApiValidationError).data;
                break;
            case ApiError:
                message = error.message;
                statusCode = ErrorStatusCode.ApiError;
                apiStatusCode = 400;
                break;
            case EntityNotFoundError:
            case NotFoundError:
                message = 'Entity not found';
                statusCode = ErrorStatusCode.NotFound;
                apiStatusCode = 404;
                break;
        }

        return {
            status: 'error',
            message,
            statusCode,
            apiStatusCode,
            data
        }
    }

    protected toSuccessResponse<T extends object>(data: T, message?: string): SuccessResponse<T> {
        return {
            data,
            status: 'success',
            message,
        }
    }

    protected get(path: string, ...rest: (MiddlewareMethod | Method)[]) {
        const { method, middlewares } = this.parseMethods(rest);

        this.router.get(
            path,
            ...middlewares,
            method,
        );
    }

    protected post(path: string, ...rest: (MiddlewareMethod | Method)[]) {
        const { method, middlewares } = this.parseMethods(rest);

        this.router.post(
            path,
            ...middlewares,
            method,
        );
    }

    protected put(path: string, ...rest: (MiddlewareMethod | Method)[]) {
        const { method, middlewares } = this.parseMethods(rest);

        this.router.put(
            path,
            ...middlewares,
            method,
        );
    }

    protected delete(path: string, ...rest: (MiddlewareMethod | Method)[]) {
        const { method, middlewares } = this.parseMethods(rest);

        this.router.delete(
            path,
            ...middlewares,
            method,
        );
    }

    private parseMethods(rest: (MiddlewareMethod | Method)[]) {
        const middlewares = rest.slice(0, -1).map((fn) => this.middleware(fn as MiddlewareMethod));
        const method = this.apiMethod(rest.at(-1)?.bind(this) as Method);

        return {
            middlewares,
            method,
        };
    }
}