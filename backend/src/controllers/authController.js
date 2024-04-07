const bcrypt = require('bcrypt')
const { validationResult, matchedData } = require('express-validator')

const register = async (req, res) => {
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

const login = async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.json({
            erro: errors.mapped()
        })
    }
    res.json({
        messagem: "Funcionando"
    })
}

module.exports = {register, login}