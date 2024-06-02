const { Router } = require('express')
const passport = require('../config/passport')
const {validateUserId} = require('../validation/params')
const authValidator = require('../validation/authValidator')
const authController = require('../controllers/authController')
const clientController = require('../controllers/clientController')
const adminValidator = require('../validation/adminValidator')
const adminController = require('../controllers/adminController')
const middlewares = require('../middlewares/global')

const route = Router()

route.post("/register", authValidator.registerSchema, middlewares.validationErrors, authController.register);
route.post("/login", authValidator.loginSchema, middlewares.validationErrors, authController.login);

//rotas administrativas
route.get("/admin/users", passport.isAdmin, adminController.getAllUsers); 
route.put("/admin/users/:id",  validateUserId, passport.isAdmin, adminValidator.updateUserSchema, middlewares.validationErrors, adminController.updateUser); 
route.delete("/admin/users/:id", validateUserId, passport.isAdmin, middlewares.validationErrors, adminController.deleteUser); 

// // rotas que os profisionais usam para criar/editar/deletar serviços
// route.post("/provider/services", providerValidator.createSchema, middlewares.validationErrors, providerController.createService); 
// route.put("/provider/services/:id", providerValidator.updateSchema, middlewares.validationErrors, providerController.updateService); 
// route.delete("/provider/services/:id", providerValidator.deleteSchema, middlewares.validationErrors, providerController.deleteService); 

// // rota que os clientes usam para visualizar os serviços
route.get("/providers", clientController.getAllProviders)
route.get("/providers/services", clientController.getAllServices)
route.get("/providers/:id/services",validateUserId, clientController.getProviderServicesById)

// localizações
route.get("/locations", clientController.getLocations);


module.exports = route