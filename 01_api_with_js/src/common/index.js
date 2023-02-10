const httpErrors = require('http-errors')


module.exports.res = {
    success: (response, status = 200, message = "Ok", body = {}) =>
        response.status(status).json({ message, body }),
    error: (response, error = null) => {
        const { statusCode, message } = error ? error : new httpErrors.InternalServerError()

        response.status(statusCode).json({ message })

    }
}