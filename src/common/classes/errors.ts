import type { ValidationError } from 'class-validator';

export class ServerError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Api Error'

        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Not Found Error';

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class ApiValidationError extends Error {
    declare data: unknown;

    constructor(errors: ValidationError[]) {
        super('Validation Error');

        const strErrors = errors.reduce<string[]>((acc, error) => {
            const constraints = Object.values(error.constraints || {});

            return [...acc, ...constraints];
        }, [])

        this.message = strErrors.join(', ');
        this.data = errors.reduce<Record<string, string[]>>((acc, error) => {
            acc[error.property] = Object.values(error.constraints || {});

            return acc;
        }, {});

        Object.setPrototypeOf(this, ApiValidationError.prototype);
    }
}