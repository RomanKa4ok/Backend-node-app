import { Router } from 'express';
import type { Application, Response, Request } from 'express';
import type { ApiRequest, ResponseStatus } from 'src/common/types/api.types';
import type { TAny } from 'src/common/types';
import type LoggerService from 'src/common/services/logger.service';

import 'src/common/services/logger.service'
import { ErrorStatusCode } from 'src/common/constants';
import { ApiError, NotFoundError } from 'src/common/classes/errors';
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
    apiStatusCode: number;
}

type Method<T extends SuccessResponse | never = SuccessResponse> = (
    req: ApiRequest<TAny, TAny, TAny>,
    res: Response
) => Promise<T>

export default abstract class ApiController {
    protected abstract basePath: string;
    protected router: Router;
    protected logger: LoggerService;

    constructor(logger: LoggerService) {
        this.router = Router();
        this.logger = logger.createChild(this.constructor.name);
    }

    register(app: Application | Router) {
        app.use(this.basePath, this.router as TAny);
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
                apiStatusCode: 500
            }
        }

        let message = 'Internal Server Error';
        let statusCode = ErrorStatusCode.InternalServerError;
        let apiStatusCode = 500;

        switch (error.constructor) {
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
            apiStatusCode
        }
    }

    protected toSuccessResponse<T extends object>(data: T, message?: string): SuccessResponse<T> {
        return {
            data,
            status: 'success',
            message,
        }
    }
}