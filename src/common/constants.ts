export enum EntityStatus {
    Draft = 'draft',
    Active = 'active',
    Deleted = 'deleted',
}

export enum Environment {
    Local = 'local',
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

export enum ErrorStatusCode {
    InternalServerError = 'INTERNAL_SERVER_ERROR',
    ValidationError = 'VALIDATION_ERROR',
    ApiError = 'API_ERROR',
    NotFound = 'NOT_FOUND',
}