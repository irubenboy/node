const { json } = require('express')

const excelGenerator = (doctors, name, response) => {
    const xl = require('excel4node')

    let wb = new xl.Workbook(),
        ws = wb.addWorksheet("Doctors")

    for (let i = 0; i < Object.keys(doctors[0]).length; i++) {
        ws.cell(1, i + 1).string(Object.keys(doctors[0])[i])
    }

    for (let i = 0; i < doctors.length; i++) {
        for (let j = 0; j < Object.values(doctors[0]).length; j++) {
            let data = Object.values(doctors[i])[j]
            if (typeof data === "string") {
                ws.cell(i + 2, j + 1).string(data)
            } else {
                ws.cell(i + 2, j + 1).number(data)
            }
        }
    }

    wb.write(`${name}.xlsx`, response)
}

const jsonGenerator = (doctors, response) => {
    response.setHeader("content-type", "application/json")

    response.end(JSON.stringify(doctors, null, 4))
}

const csvGenerator = (doctors, response) => {


    const csvString = [Object.keys(doctors[0])].concat(doctors).map(el => Object.values(el).toString()).join('\n');

    response.setHeader("content-type", "text/csv")

    response.end(csvString)
}

const xmlGenerator = (doctors, response) => {
    const xml = require('fast-xml-parser')
    const builder = new xml.XMLBuilder({ arrayNodeName: "doctor", format: true })

    const xmlContent = `<?xml version='1.0'?>
        <doctors>
            ${builder.build(doctors)}
        </doctors>`

    response.setHeader("content-type", "text/xml")

    response.end(xmlContent)
}

const htmlGenerator = (doctors, response) => {
    const d = [Object.keys(doctors[0])].concat(doctors).map(el => Object.values(el));

    const htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <table>
                ${d.map(el => `<tr>${el.map(e => `<td>${e}</td>\n`).join(" ")}</tr>\n`).join(" ")}
            </table>
        </body>
        </html>`

    response.setHeader("content-type", "text/html")
    response.end(htmlContent)

}

const utils = { excelGenerator, jsonGenerator, csvGenerator, xmlGenerator, htmlGenerator }

module.exports = utils