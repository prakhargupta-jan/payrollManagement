const handleDevError = (err, res) => {
    res.status(err.statusCode || 501).json({
        status: err.status || 'Unknown Error',
        message: err.message,
        err
    })
}

const handleProdError = (err, res) => {
    if (err.isOperational) {
        err.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        err.status(500).json({
            status: 'error',
            message: 'something went very wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    console.log(err);
    if (process.env.NODE_ENV == 'dev') {
        return handleDevError(err, res);
    } else {
        return handleProdError(err, res);
    }
}