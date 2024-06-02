const { param } = require('express-validator');


module.exports = {
    validateUserId: [
        param('id').isInt().withMessage('ID deve ser um número inteiro')
    ],
}