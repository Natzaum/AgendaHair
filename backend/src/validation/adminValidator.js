const checkSchema = require('express-validator')
const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com'];

const isValidEmailDomain = (value) => {
    const emailDomain = value.split('@')[1];
    return allowedDomains.includes(emailDomain);
};

module.exports = {
    createUserSchema: checkSchema.checkSchema({
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
                    if(!isValidEmailDomain){
                        throw new Error("O dominio do email não é permitido!")
                    }
                    return true
                }
            },
            isEmail: true,
            errorMessage: "Email invalido!"
        },

        password: {
            isLength: {
                options: {
                    min: 8,
                    max: 100
                }
            },
            errorMessage: "Alterção mal sucedida"
        }
    }),

    updateUserSchema: checkSchema.checkSchema({
        name: {
            isLength: {
                options: {
                    min: 6,
                    max: 50
                }
            },
            errorMessage: "Alteração mal sucedida"
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
                    if(!isValidEmailDomain){
                        throw new Error("O dominio do email não é permitido!")
                    }
                    return true
                }
            },
            errorMessage: "Alteração mal suedida"
        },
        
        password: {
            isLength: {
                options: {
                    min: 8,
                    max:100
                }
            },
            errorMessage: "A senha não possui os requisitos necessários"
        }
    }),

    deleteUserSchema: checkSchema.checkSchema({
        name: {
            isLength: {
                options: {
                    min: 6,
                    max: 50
                }
            },
            errorMessage: "Não foi possivel deletar o nome do usuario"
        },

        email: {
            isLength: {
                options: {
                    min: 7,
                    max: 50
                }
            },
            errorMessage: "Não foi possivel deletar o e-mail do usuario"
        },
        
        password: {
            isLength: {
                options: {
                    min: 8,
                    max:100
                }
            },
            errorMessage: "Não foi possivel deletar a senha do usuario"
        }
    })

}