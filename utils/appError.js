class AppError extends Error {
    constructor(statusCode, message) {
        super(message)
        this.isOperational = true
        this.status = statusCode.toString().startsWith('4') ? 'Failure' : 'Error'
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError