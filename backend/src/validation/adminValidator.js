const checkSchema = require('express-validator')
const {validateCPF,validateCNPJ,isValidEmailDomain} = require('./validation-functions/functions')



module.exports = {
    updateUserSchema: checkSchema.checkSchema({
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
                    if (!isValidEmailDomain(value)) {
                        throw new Error("O dominio do email não é permitido")
                    }
                    return true
                }
            },
            isEmail: true,
            errorMessage: "Email inválido"
        },

        CPF: {
            optional: { options: { nullable: true } },
            custom: {
                options: (value) => validateCPF(value),
                errorMessage: 'CPF inválido'
            }
        },

        CNPJ: {
            optional: { options: { nullable: true } },
            custom: {
                options: (value) => validateCNPJ(value),
                errorMessage: 'CNPJ inválido'
            }
        },

        type: {
            isIn: {
                options: [["CLIENT", "PROVIDER", "ADMIN"]]
            },
            errorMessage: "Type inválido"
        },

        sex: {
            isIn: {
                options: [["Masculino", "Feminino", "Indefinido"]]
            }
        }
        
    })
}