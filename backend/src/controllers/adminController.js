const bcrypt = require('bcrypt')
const { validationResult, matchedData } = require('express-validator')

const createUser = async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.json({
            erro: errors.mapped()
        })
    }
    res.json({
        messagem: 'Criando funcionando',
    })
}

const updateUser = async(req, res) => {
    console.log(req.body)
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.json({
            erro: errors.mapped()
        })
    }
    res.json({
        messagem: 'Update funcionando'
    })
}

const deleteUser = async(req, res) => {
    console.log(req.body)
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.json({
            erro: errors.mapped()
        })
    }
    res.json({
        messagem: 'Delete funcionando'
    })
}

module.exports = {createUser, updateUser, deleteUser}