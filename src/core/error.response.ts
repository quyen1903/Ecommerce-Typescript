import {
	ReasonPhrases,
	StatusCodes
} from 'http-status-codes';

class ErrorResponse extends Error{
    status: number
    constructor(message: string,status: number){
        super(message),
        this.status = status
        Error.captureStackTrace(this,this.constructor)
    }
}

class AuthFailureError extends ErrorResponse{
    constructor(message: string,statusCode=StatusCodes.UNAUTHORIZED){
        super(message,statusCode)
    }
}

class BadRequestError extends ErrorResponse{
    constructor(message: string, statusCode = StatusCodes.BAD_REQUEST){
        super(message,statusCode)
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor(message: string, statusCode=StatusCodes.CONFLICT){
        super(message,statusCode)
    }
}


class NotFoundError extends ErrorResponse{
    constructor(message: string,statusCode=StatusCodes.NOT_FOUND){
        super(message,statusCode)
    }
}

class ForbiddenError extends ErrorResponse{
    constructor(message: string, statusCode=StatusCodes.FORBIDDEN){
        super(message,statusCode)
    }
}


export {
    AuthFailureError,
    BadRequestError,
    ConflictRequestError,
    NotFoundError,
    ForbiddenError,
}