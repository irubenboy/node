const express = require('express') // Framework que facilita la creación del servidor

const app = express()

app.use(express.json()) // Utiliza el request.body parseándolo en JSON
const PORT = 3000

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

app.get("/", (request, response) => {
    response.send("<h1>Hello World</h1>")
})

app.get("/api/notes", (request, response) => {
    response.json(notes)
})

app.get("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id)

    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }

})

app.delete("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id)

    notes = notes.filter(note => note.id != id)

    response.status(204).json()
})

app.post("/api/notes", (request, response) => {
    const note = request.body

    if (!note || note.content) {
        return response.status(400).json({
            error: "note.content is missing"
        })
    }

    const ids = notes.map(note => note.id)

    const maxId = Math.max(ids)

    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== undefined ? note.important : false,
        date: new Date().toISOString(),
    }

    notes = [...notes, newNote]

    response.json(newNote)
})
app.listen(PORT, () => console.log(`Server listening port ${PORT}`))