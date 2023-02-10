import createHttpError from "http-errors"
import express from "express"


const success = (response: express.Response, status = 200, message = "ok", body = {}) => response.status(status).json({ message, body })


const fail = (response: express.Response, error: createHttpError.HttpError | null) => {
    const { statusCode, message } = error ? error : new createHttpError.InternalServerError()

    response.status(statusCode).json({ message })
}

export const res = { success, fail }