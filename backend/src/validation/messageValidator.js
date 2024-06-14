const checkSchema = require('express-validator')

module.exports = {
    messageValidator: checkSchema.checkSchema({
        message: {
            notEmpty: true,
            isLength: {
                max: 5000,
            },
            errorMessage: "content deve ser menor do que 5000 caracteres e maior do que 1 caractere"
        },
        email: {
            isLength: {
                options: {
                    min: 7,
                    max: 50
                }
            },
            isEmail: true,
            errorMessage: "Email inválido"
        },
        
    })
}