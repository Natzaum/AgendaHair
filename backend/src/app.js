require("dotenv").config()
const express = require ('express')
const jwt = require('jsonwebtoken')
const route = require('./routes/routes')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport');

const app = express()
const PORT = process.env.PORT || 3333

app.use(passport.initialize());
app.use(bodyParser.json())
app.use(cors())

const errorHandler = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status);
    } else {
        res.status(400);
    }
    if(err.message) {
        res.json({ error: err.message });
    } else {
        res.json({ error: 'Ocorreu algum erro.' });
    }
}


app.use(route)
app.use(errorHandler);
app.listen(3333, () => {
    console.log(`Server conectado na porta ${PORT}`)
})



