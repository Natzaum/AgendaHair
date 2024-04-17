const checkSchema = require('express-validator')
const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com'];

const isValidEmailDomain = (value) => {
    const emailDomain = value.split('@')[1];
    return allowedDomains.includes(emailDomain);
};

module.exports = {
    registerSchema: checkSchema.checkSchema({
        name: {
            isLength: {
                options: {
                    min: 6,
                    max: 50
                }
            },
            errorMessage: "O nome não condiz com os limites de tamanho"
        },

        email: {
            isLength: {
                options: {
                    min: 7,
                    max: 50
                }
            },
            custom: {
                options: (value) => {
                    if(!isValidEmailDomain(value)){
                        throw new Error("O dominio do email não é permitido")
                    }
                    return true
                }
            },
            isEmail: true,
            errorMessage: "Email inválido"
        },

        password: {
            isLength: {
                options: {
                    min: 8,
                    max: 100
                }
            },
            errorMessage: "A senha não condiz com os limites de tamanho"
        }
    }),

    loginSchema: checkSchema.checkSchema({
        email: {
            isLength: {
                options: {
                    min: 7,
                    max: 50
                }
            },

            isEmail: true,
            errorMessage: "Email inválido para login"
        },

        password: {
            isLength: {
                options: {
                    min: 8,
                    max: 100
                }
            },
            errorMessage: "Senha incorreta"
        }
    })
}