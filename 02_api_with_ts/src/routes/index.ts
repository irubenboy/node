import express from 'express'
import { controller } from '../controllers/index';

const router = express.Router()

// Defines routes
router.get('/doctors', controller.getAll)
    .get('/doctors/export', controller.exportExcel)
    .get('/doctors/export/excel', controller.exportExcel)
    .get('/doctors/export/html', controller.exportHTML)
    .get('/doctors/export/json', controller.exportJSON)
    .get('/doctors/export/xml', controller.exportXML)
    .get('/doctors/export/csv', controller.exportCSV)
    .post('/doctors', controller.insert)
    .get('/doctors/:id', controller.getById)
    .put('/doctors/:id', controller.update)
    .delete('/doctors/:id', controller.del)


export { router }