const db = require('../db')
const { res } = require('../common')
const log = require('debug')("app:doctor-controllers")
const httpErrors = require('http-errors')


const getAll = async (request, response) => {

    try {
        let doctors = await db.getAll()
        res.success(response, 200, "Doctors", doctors)
    } catch (error) {
        log(error)
        res.error(response)
    }
}

const getById = async (request, response) => {
    try {
        let { params: { id } } = request
        let doctor = await db.getById(id)
        if (!doctor) {
            return res.error(response, new httpErrors.NotFound())
        }

        return res.success(response, 200, `Doctor ${id}`, doctor)
    } catch (error) {
        log(error)
        res.error(response)
    }
}

const insert = async (request, response) => {

    try {

        let { body: doctor } = request
        let year = new Date().getFullYear()

        delete doctor.id

        if (!doctor.dni || !doctor.name || !doctor.collegiateNumber) {
            return res.error(response, new httpErrors.BadRequest())
        }

        if (doctor.year > year || doctor.year < 1988) {
            doctor.year = year
        }

        let newDoctor = await db.insert(doctor)

        return res.success(response, 200, "Doctor inserted successfully", newDoctor)
    } catch (error) {
        log(error)
        res.error(response)
    }
}

const update = async (request, response) => {
    try {
        let { params: { id }, body: doctor } = request

        delete doctor.id

        let newDoctor = await db.update(id, doctor)

        return res.success(response, 200, "Doctor updated successfully", newDoctor)
    } catch (error) {
        log(error)
        res.error(response)
    }
}

const del = async (request, response) => {
    try {
        let { params: { id } } = request

        let doctor = await db.del(id)

        if (!doctor) {
            return res.error(response, new httpErrors.NotFound("Doctor no found"))
        }

        return res.success(response, 200, `Doctor ${id} deleted successfully`, doctor)
    } catch (error) {
        log(error)
        res.error(response)
    }
}

const exportExcel = (request, response) => {
    try {
        db.generateExcel("Doctors", response)
    } catch (error) {
        log(error)
        res.error(response)
    }
}

const exportJSON = (request, response) => {
    try {
        db.generateJSON(response)
    } catch (error) {
        log(error)
        res.error(response)
    }
}
const exportHTML = (request, response) => {
    try {
        db.generateHTML(response)
    } catch (error) {
        log(error)
        res.error(response)
    }
}
const exportXML = (request, response) => {
    try {
        db.generateXML(response)
    } catch (error) {
        log(error)
        res.error(response)
    }
}
const exportCSV = (request, response) => {
    try {
        db.generateCSV(response)
    } catch (error) {
        log(error)
        res.error(response)
    }
}

const controller = { getAll, getById, insert, update, del, exportExcel, exportCSV, exportHTML, exportJSON, exportXML }

module.exports = controller