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