const { Router } = require('express')
const passport = require('../config/passport')
const rateLimit = require('express-rate-limit')
const {validateUserId} = require('../validation/params')

const authValidator = require('../validation/authValidator')
const authController = require('../controllers/authController')

const locationController = require('../controllers/locationController')

const clientController = require('../controllers/clientController')
const clientValidator = require('../validation/clientValidator')

const serviceController = require('../controllers/serviceController')
const providerValidator = require('../validation/providerValidator')

const messageController = require('../controllers/messageController')
const messageValidator = require('../validation/messageValidator')

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

// profisionais
route.post("/provider/services", apiRequestLimiter, providerValidator.createSchema, middlewares.validationErrors, serviceController.createServiceWithLocation); 
// route.put("/provider/services/:id", providerValidator.updateSchema, middlewares.validationErrors, serviceController.updateService); 
route.delete("/provider/services/:id", validateUserId, serviceController.deleteService); 
route.delete("/schedules/:id", validateUserId, serviceController.deleteSchedule); 

// // rota que os clientes usam para visualizar os serviços
route.get("/providers", clientController.getAllProviders)
route.get("/providers/services", serviceController.getAllServices)
route.post("/providers/services/:id/contact", apiRequestLimiter, validateUserId, clientValidator.createContact, middlewares.validationErrors, clientController.contactServiceById)
route.get("/schedules/contacted", clientController.getContactedServices)
// route.get("/providers/:id/services",validateUserId, clientController.getProviderServicesById)

// localizações
route.get("/locations", locationController.getLocations);

// categorias
route.get("/categories", clientController.getCategories);

// messages
route.get("/messages", messageController.getReceivedMessagesById);
route.post("/messages/sent", apiRequestLimiter, messageValidator.messageValidator,  middlewares.validationErrors, messageController.sendMessage);


module.exports = route