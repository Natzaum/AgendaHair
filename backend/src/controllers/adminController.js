const admin = require('../models/adminModel')

const getAllUsers = async (req, res) => {
    console.log(req.body)

    res.json({
        messagem: 'getAllUsers funcionando não implementado',
    })
}

const updateUser = async(req, res) => {

    const validData = req.validData;
    let accountId = req.params.id
    try {

        const account = await admin.updateUser(accountId)

        if (account == 'not found') {
            return res.status(401).json({ message: 'Conta não existente' });
        }


        res.status(200).json({ message: 'Usuário modificado com sucesso', account:validData });
    } catch (error) {
        console.error('Erro ao modificar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
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

module.exports = {getAllUsers, updateUser, deleteUser}