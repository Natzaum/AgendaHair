const checkSchema = require('express-validator')

module.exports = {
    createSchema: checkSchema.checkSchema({
        available_days: {
            isArray: {
                min:1,
                max:7
            },
            errorMessage: "Array de dias disponiveis está incorreto"
        },

        name: {
            isLength: {
                options: {
                    min: 1,
                    max: 200
                }
            },
            errorMessage: "Nome inválido"
        },


        cep: {
            isLength: {
                options: {
                    min: 1,
                    max: 15
                }
            },
            errorMessage: "Cep inválido"
        },

        city: {
            notEmpty: true,
            errorMessage: "A city não condiz com os limites de tamanho"
        },
        street: {
            notEmpty: true,
            errorMessage: "A city não condiz com os limites de tamanho"
        },

        close_time:{
            notEmpty: true,
            errorMessage: "O close_time não condiz com os limites de tamanho"
        },

        open_time:{
            notEmpty: true,
            errorMessage: "O open_time não condiz com os limites de tamanho"
        },

        numero: {
            notEmpty: true,
            isNumeric: {
                min: 1,
            },
            errorMessage: "O numero não condiz com os limites de tamanho"
        },

        price: {
            notEmpty: true,
            isNumeric: {
                min: 1,
                max:9999
            },
            errorMessage: "O price não condiz com os limites de tamanho"
        },
        state: {
            notEmpty: true,
            errorMessage: "O state não condiz com os limites de tamanho"
        },
        category: {
            notEmpty: true,
            errorMessage: "A category não condiz com os limites de tamanho"
        }
    }),

}