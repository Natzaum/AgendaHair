const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { matchedData } = require('express-validator');
const user = require('../models/userModels')

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extrair dados válidos do corpo da requisição
    const validData = matchedData(req);
    console.log('Register Endpoint!')


    const hashedPassword = await bcrypt.hash(validData.password, 10);
    
// e se ja existe uma conta que foi criada com o email informado a conta não deve ser criada no banco de dados
// então a API vai retornar que a conta ja existe, utilizando o res.status(409).json{message: 'conta ja existe'}


    try {

        const response = await user.createUser(validData)

        console.log(response);

        res.status(200).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const validData = matchedData(req);
    
    try {
        console.log(errors)
        const user = await user.getUserByEmail()

        const passwordMatch = await bcrypt.compare(validData.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        res.status(200).json({ message: 'Login bem-sucedido', userId: user.id, token: user.token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = { register, login };