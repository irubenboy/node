import { db } from '../db/index'
import { res } from '../common'
import debug from 'debug'
import createHttpError from "http-errors"
import express from 'express'

const log = debug("app:doctor-controllers")

const getAll = (request: express.Request, response: express.Response) => {

    try {
        let doctors = db.getAll()
        res.success(response, 200, "Doctors", doctors)
    } catch (error) {
        log(error)
        res.fail(response)
    }
}

const getById = (request: express.Request, response: express.Response) => {
    try {
        let { params: { id } } = request
        let doctor = db.getById(+id)
        if (!doctor) {
            return res.fail(response, new createHttpError.NotFound())
        }

        return res.success(response, 200, `Doctor ${id}`, doctor)
    } catch (error) {
        log(error)
        res.fail(response)
    }
}

const insert = async (request: express.Request, response: express.Response) => {

    try {

        let { body: doctor } = request
        let year = new Date().getFullYear()

        delete doctor.id

        if (!doctor.dni || !doctor.name || !doctor.collegiateNumber) {
            return res.fail(response, new createHttpError.BadRequest())
        }

        if (doctor.year > year || doctor.year < 1988) {
            doctor.year = year
        }

        let newDoctor = await db.insert(doctor)

        return res.success(response, 200, "Doctor inserted successfully", newDoctor)
    } catch (error) {
        log(error)
        res.fail(response)
    }
}

const update = async (request: express.Request, response: express.Response) => {
    try {
        let { params: { id }, body: doctor } = request

        delete doctor.id

        let newDoctor = await db.update(+id, doctor)

        return res.success(response, 200, "Doctor updated successfully", newDoctor)
    } catch (error) {
        log(error)
        res.fail(response)
    }
}

const del = async (request: express.Request, response: express.Response) => {
    try {
        let { params: { id } } = request

        let doctor = await db.del(+id)

        if (!doctor) {
            return res.fail(response, new createHttpError.NotFound("Doctor no found"))
        }

        return res.success(response, 200, `Doctor ${id} deleted successfully`, doctor)
    } catch (error) {
        log(error)
        res.fail(response)
    }
}

const exportExcel = (request: express.Request, response: express.Response) => {
    try {
        db.generateExcel("Doctors", response)
    } catch (error) {
        log(error)
        res.fail(response)
    }
}

const exportJSON = (request: express.Request, response: express.Response) => {
    try {
        db.generateJSON(response)
    } catch (error) {
        log(error)
        res.fail(response)
    }
}
const exportHTML = (request: express.Request, response: express.Response) => {
    try {
        db.generateHTML(response)
    } catch (error) {
        log(error)
        res.fail(response)
    }
}
const exportXML = (request: express.Request, response: express.Response) => {
    try {
        db.generateXML(response)
    } catch (error) {
        log(error)
        res.fail(response)
    }
}
const exportCSV = (request: express.Request, response: express.Response) => {
    try {
        db.generateCSV(response)
    } catch (error) {
        log(error)
        res.fail(response)
    }
}

export const controller = { getAll, getById, insert, update, del, exportExcel, exportCSV, exportHTML, exportJSON, exportXML }

