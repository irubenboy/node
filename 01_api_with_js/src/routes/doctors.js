const express = require('express')
const { doctorsCtlr } = require('../controllers');
const router = express.Router()

// Defines routes
router.get('/doctors', doctorsCtlr.getAll)
    .get('/doctors/export', doctorsCtlr.exportExcel)
    .get('/doctors/export/excel', doctorsCtlr.exportExcel)
    .get('/doctors/export/html', doctorsCtlr.exportHTML)
    .get('/doctors/export/json', doctorsCtlr.exportJSON)
    .get('/doctors/export/xml', doctorsCtlr.exportXML)
    .get('/doctors/export/csv', doctorsCtlr.exportCSV)
    .post('/doctors', doctorsCtlr.insert)
    .get('/doctors/:id', doctorsCtlr.getById)
    .put('/doctors/:id', doctorsCtlr.update)
    .delete('/doctors/:id', doctorsCtlr.del)


module.exports = router
