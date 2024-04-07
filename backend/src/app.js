const dotenv = require ('dotenv')
const express = require ('express')
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3333

app.listen(3333, () => {
    console.log(`Server conectado na porta ${PORT}`)
})