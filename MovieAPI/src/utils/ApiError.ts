export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string) {
        super(400, message);
        this.name = 'BadRequestError';
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string) {
        super(404, message);
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string) {
        super(401, message);
        this.name = 'UnauthorizedError';
    }
}

export class InternalServerError extends ApiError {
    constructor(message: string) {
        super(500, message);
        this.name = 'InternalServerError';
    }
}