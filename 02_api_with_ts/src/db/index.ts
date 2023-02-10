import { utils } from "../utils/utils"
import fs from "fs/promises"
import { debug } from "debug"
import { Doctor } from "../entity/data/doctor";
import data from '../files/doctos.json'
import express from 'express'

const log = debug("app:db");

const dir = __dirname.replace("\\db", "")
const file = `${dir}\\doctors.json`

const getAll: () => Doctor[] = () => data.map(el => Doctor.fromJSON(el))

const getById: (id: number) => Doctor = (id: number) => Doctor.fromJSON(data.find(doctor => doctor.id == id))

const insert = async (newDoctor: Doctor) => {
    let doctors = getAll()

    let maxId = doctors.map(doctor => doctor.id).reduce((a, b) => Math.max(a, b), -Infinity)
    log(maxId)

    newDoctor.id = maxId + 1

    doctors.push(newDoctor)

    await fs.writeFile(file, JSON.stringify(doctors))

    return newDoctor
}

const update = async (id: number, newDoctor: Doctor) => {
    let doctors = await getAll()

    newDoctor.id = id

    for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].id == id) {
            doctors[i] = newDoctor
        }
    }


    await fs.writeFile(file, JSON.stringify(doctors))

    return newDoctor
}

const del = async (id: number) => {
    let doctors = getAll().filter(doctor => doctor.id != id)
    let doctor = getAll().find(doctor => id == doctor.id)

    await fs.writeFile(file, JSON.stringify(doctors))

    return doctor
}

const generateExcel = async (name: String, res: express.Response) => utils.excelGenerator(getAll(), name, res)

const generateJSON = async (res: express.Response) => utils.jsonGenerator(getAll(), res)


const generateCSV = async (res: express.Response) => utils.csvGenerator(getAll(), res)


const generateXML = async (res: express.Response) => utils.xmlGenerator(getAll(), res)

const generateHTML = async (res: express.Response) => utils.htmlGenerator(getAll(), res)

export const db = { getAll, getById, insert, update, del, generateExcel, generateJSON, generateCSV, generateXML, generateHTML }

