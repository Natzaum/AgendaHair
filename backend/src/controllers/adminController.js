const bcrypt = require('bcrypt')
const { validationResult, matchedData } = require('express-validator')

const createUser = async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.json({
            erro: errors.mapped()
        })
    }
    res.json({
        messagem: 'Funcionando!',
    })
}

module.exports = {createUser}