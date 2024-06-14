const { Router } = require('express')
const passport = require('../config/passport')
const rateLimit = require('express-rate-limit')
const {validateUserId} = require('../validation/params')

const authValidator = require('../validation/authValidator')
const authController = require('../controllers/authController')

const clientController = require('../controllers/clientController')
const clientValidator = require('../validation/clientValidator')

const providerController = require('../controllers/providerController')
const providerValidator = require('../validation/providerValidator')

const messageController = require('../controllers/messageController')
const messageValidator = require('../validation/messageValidator')

const adminValidator = require('../validation/adminValidator')
const adminController = require('../controllers/adminController')
const middlewares = require('../middlewares/global')


const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 2 requests per windowMs
    handler: function (req, res, /*next*/) {
        return res.status(429).json({
          error: 'You sent too many requests. Please wait a while then try again'
        })
    }
})

const route = Router()

route.post("/register", apiRequestLimiter, authValidator.registerSchema, middlewares.validationErrors, authController.register);
route.post("/login", apiRequestLimiter, authValidator.loginSchema, middlewares.validationErrors, authController.login);

//rotas administrativas
route.get("/admin/users", passport.isAdmin, adminController.getAllUsers); 
route.put("/admin/users/:id",  validateUserId, passport.isAdmin, adminValidator.updateUserSchema, middlewares.validationErrors, adminController.updateUser); 
route.delete("/admin/users/:id", validateUserId, passport.isAdmin, middlewares.validationErrors, adminController.deleteUser); 

// profisionais
route.post("/provider/services", apiRequestLimiter, providerValidator.createSchema, middlewares.validationErrors, providerController.createServiceWithLocation); 
// route.put("/provider/services/:id", providerValidator.updateSchema, middlewares.validationErrors, providerController.updateService); 
// route.delete("/provider/services/:id", providerValidator.deleteSchema, middlewares.validationErrors, providerController.deleteService); 

// // rota que os clientes usam para visualizar os serviços
route.get("/providers", clientController.getAllProviders)
route.get("/providers/services", clientController.getAllServices)
route.post("/providers/services/:id/contact", apiRequestLimiter, validateUserId, clientValidator.createContact, middlewares.validationErrors, clientController.contactServiceById)
route.get("/schedules/contacted", clientController.getContactedServices)
// route.get("/providers/:id/services",validateUserId, clientController.getProviderServicesById)

// localizações
route.get("/locations", clientController.getLocations);

// categorias
route.get("/categories", clientController.getCategories);

// messages
route.get("/messages", messageController.getReceivedMessagesById);
route.post("/messages/sent", apiRequestLimiter, messageValidator.messageValidator,  middlewares.validationErrors, messageController.sendMessage);


module.exports = route