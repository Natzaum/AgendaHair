const { Router } = require('express')
const authValidator = require('../validation/authValidator')
const authController = require('../controllers/authController')
const adminValidator = require('../validation/adminValidator')
const adminController = require('../controllers/adminController')

const route = Router()

route.post("/register", authValidator.registerSchema, authController.register)
route.post("/login", authValidator.loginSchema, authController.login)

route.post("/admin/user/create", adminValidator.createUserSchema, adminController.createUser)
route.post("/admin/user/:id/update", adminValidator.updateUserSchema, adminController.updateUser)
route.delete("/admin/user/:id/delete", adminValidator.deleteUserSchema, adminController.deleteUser)

/*route.put("/provider-tool/services/create", providerValidator.createSchema, providerController.putUser)
route.post("/provider-tool/services/:id/update", providerValidator.updateSchema, providerController.postUser)
route.delete("/provider-tool/services/:id/delete", providerValidator.deleteSchema, providerController.deleteUser)

route.get("/providers/:id/services", clientConntroller.getProviderServicesById)
route.get("/locations", clientController.getLocations)

route.post("/services/:id/post-comment", clientValidator.postSchema, clientController.postUser)

route.delete("/services/:id/delete-comment",clientValidator.deleteSchema, clientController.deleteUser)
*/
module.exports = route