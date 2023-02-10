const utils = require('../utils/utils')

const fs = require('fs').promises
const log = require('debug')("app:db");

const dir = __dirname.replace("\\db", "")

const file = `${dir}\\files\\doctors.json`
const getAll = async () => JSON.parse(await fs.readFile(file, "utf-8"))

const getById = async (id) => (await getAll()).find(doctor => doctor.id == id)

const insert = async (newDoctor) => {
    let doctors = await getAll()

    let maxId = doctors.map(doctor => doctor.id).reduce((a, b) => Math.max(a, b), -Infinity)
    log(maxId)

    delete newDoctor.id

    newDoctor.id = maxId + 1


    doctors.push(newDoctor)

    await fs.writeFile(file, JSON.stringify(doctors))

    return newDoctor
}

const update = async (id, newDoctor) => {
    let doctors = await getAll()

    delete newDoctor.id
    newDoctor.id = id

    for (let i = 0; i < doctors.length; i++) {
        log(`line 38 ${doctors[i]}`, id)
        if (doctors[i].id == id) {
            doctors[i] = newDoctor
        }
    }


    await fs.writeFile(file, JSON.stringify(doctors))

    return newDoctor
}

const del = async (id) => {
    let doctors = (await getAll()).filter(doctor => doctor.id != id)
    let doctor = (await getAll()).find(doctor => id == doctor.id)

    await fs.writeFile(file, JSON.stringify(doctors))

    return doctor
}

const generateExcel = async (name, res) => utils.excelGenerator(await getAll(), name, res)

const generateJSON = async (res) => utils.jsonGenerator(await getAll(), res)


const generateCSV = async (res) => utils.csvGenerator(await getAll(), res)


const generateXML = async (res) => utils.xmlGenerator(await getAll(), res)

const generateHTML = async (res) => utils.htmlGenerator(await getAll(), res)

const db = { getAll, getById, insert, update, del, generateExcel, generateJSON, generateCSV, generateXML, generateHTML }

module.exports = db