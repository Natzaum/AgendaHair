const checkSchema = require('express-validator')

module.exports = {
    createContact: checkSchema.checkSchema({
        schedule_date: {
            notEmpty:true,
            errorMessage: "schedule_date não pode ser vazio"
        },
        
    })
}