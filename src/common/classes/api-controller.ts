import { Router } from 'express';
import type { Application, Response, Request } from 'express';
import type { ApiRequest, ResponseStatus } from 'src/common/types/api.types';
import type { TAny } from 'src/common/types';

export type SuccessResponse<T extends (object | object[]) = object> = {
    data: T,
    status: ResponseStatus,
    message?: string;
}
type ErrorResponse = {
    status: ResponseStatus,
    message: string;
    statusCode: string;
}

type Method<T extends SuccessResponse | never = SuccessResponse> = (
    req: ApiRequest<TAny, TAny, TAny>,
    res: Response
) => Promise<T>

export default abstract class ApiController {
    protected abstract basePath: string;
    protected router: Router;

    constructor() {
        this.router = Router();
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
                console.error(error);

                res.status(500).json({
                    status: 'error',
                    message: 'Internal Server Error',
                    statusCode: 'INTERNAL_SERVER_ERROR',
                } as ErrorResponse);
            }

            return this.router;
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