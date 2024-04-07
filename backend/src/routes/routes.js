const { Router } = require('express')
const authValidator = require('../validation/authValidator')
const authController = require('../controllers/authController')

const route = Router()

route.post("/register", authValidator.registerSchema, authController.register)
route.post("/login", authValidator.loginSchema, authController.login)

module.exports = route