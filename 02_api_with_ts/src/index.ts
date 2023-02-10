import express from "express"// Import express package
import debug from "debug"// Import debug package
import { router } from "./routes" // Import routes

const app = express() // Create a serve with express 
const log = debug("app:*") // Create a app debug

app.use(express.json()) // Use json on request body on express
app.use('/api', router)

const PORT = process.env.PORT || 3000 // Define port

const ROOT = "http://localhost" // define root route

// GET to '/' route -> Show a title

app.get('/', (request, response) => response.send("<h1>Welcome to Hospital Central API</h1>"))


app.listen(PORT, () => log(`Server on ${ROOT}:${PORT}`)) // Listen port and show message
