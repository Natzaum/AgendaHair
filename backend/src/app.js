const dotenv = require ('dotenv')
const express = require ('express')
const jwt = require('jsonwebtoken')
const route = require('./routes/routes')
const bodyParser = require('body-parser')

require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3333

app.use(bodyParser.json())
app.use(route)
app.listen(3333, () => {
    console.log(`Server conectado na porta ${PORT}`)
})
