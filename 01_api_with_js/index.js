const http = require('http') // Paquete nativo para realizar request y crear un servidor

// data
let notes = [
    {
        "id": 1,
        "content": "Me tengo que suscribir a @miudev en YouTube",
        "date": "2019-05-30T17:39:31-0992",
        "important": true
    },
    {
        "id": 2,
        "content": "Tengo que estudiar las clases del FullStack BootCamp",
        "date": "2019-05-30T17:39:31-0992",
        "important": false
    },
    {
        "id": 3,
        "content": "Repasar los retos de JS de miudev",
        "date": "2019-05-30T17:39:31-0992",
        "important": true
    }
]
// Crear servidor configurando la cabecera
const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
})

const PORT = 3000

app.listen(PORT) // Servidor escucha en el puerto PORT

console.log(`Server running on port ${PORT}`)