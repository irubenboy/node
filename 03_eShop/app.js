const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
mongoose.set("strictQuery", false);


require('dotenv/config')

const api = process.env.API_URL
const uri = process.env.MONGO_URI

mongoose.connect(uri).then(() => console.log("connection is ready")).catch((error) => console.log(error))

console.log(api)
