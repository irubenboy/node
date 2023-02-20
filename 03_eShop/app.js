const express = require("express")
const app = express()
const morgan = require("morgan")
const mongoose = require("mongoose")
const cors = require("cors")
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/errors-handler')
require("dotenv/config")

app.use(cors())
app.options("*", cors())

//middleware
app.use(express.json())
app.use(morgan("tiny"))
app.use(authJwt())
app.use(errorHandler)

//Routes
const categoriesRoutes = require("./routes/categories")
const productsRoutes = require("./routes/products")
const usersRoutes = require("./routes/users")
const ordersRoutes = require("./routes/orders")

const api = process.env.API_URL

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)

//Database
mongoose.set("strictQuery", false)
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "eshop-database",
    })
    .then(() => {
        console.log("Database Connection is ready...")
    })
    .catch((err) => {
        console.log(err)
    })

//Server
app.listen(3000, () => {
    console.log("server is running http://localhost:3000")
});
