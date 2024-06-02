require("dotenv").config()
const express = require ('express')
const route = require('./routes/routes')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport');
const jwtConfig = require('./config/passport');
const middlewares = require('./middlewares/global');

const app = express()
const PORT = process.env.PORT || 3333

app.use(passport.initialize());
app.use(bodyParser.json())
app.use(cors())


app.use(jwtConfig.onlyAuthenticate);
app.use(route)
app.use(middlewares.errorHandler);
app.listen(3333, () => {
    console.log(`Server conectado na porta ${PORT}`)
})



