import { injectable } from 'tsyringe';
import { NextFunction , Request, Response } from 'express';
import { TAny } from 'src/common/types';
import { validate } from 'class-validator';
import type { ValidatorOptions } from 'class-validator';
import { ApiValidationError } from 'src/common/classes/errors';

type EntitySchema = {
    new (...args: TAny[]): TAny;
}

@injectable()
export default class MiddlewaresService {
    validateParams(Schema: EntitySchema, validatorOptions?: ValidatorOptions) {
        return async (req: Request, _res: Response, next: NextFunction) => {
            const schema = new Schema(req.params);

            const errors = await validate(schema, validatorOptions);

            if (errors.length) {
                throw new ApiValidationError(errors);
            }

            req.params = schema;

            next();
        }
    }

    validateBody(Schema: EntitySchema, validatorOptions?: ValidatorOptions) {
        return async (req: Request, _res: Response, next: NextFunction) => {
            const schema = new Schema(req.body);

            const errors = await validate(schema, validatorOptions);

            if (errors.length) {
                throw new ApiValidationError(errors);
            }

            req.body = schema;

            next();
        }
    }

    validateQuery(Schema: EntitySchema, validatorOptions?: ValidatorOptions) {
        return async (req: Request, _res: Response, next: NextFunction) => {
            const schema = new Schema(req.query);

            const errors = await validate(schema, validatorOptions);

            if (errors.length) {
                throw new ApiValidationError(errors);
            }

            req.query = schema;

            next();
        }
    }
}