const bcrypt = require('bcrypt');
const user = require('../models/userModel');
const { generatejwt } = require("../config/passport");

const register = async (req, res) => {
    const validData = req.validData;

    try {
        validData.HashPassword = await bcrypt.hash(validData.password, 10);
        const account = await user.createUser(validData);

        if (account === false) {
            return res.status(401).json({ message: 'Conta já existente' });
        }

        validData.token = generatejwt({ name: validData.name, email: validData.email, role: validData.role, isAdmin: false });

        for (const item of Object.keys(validData)) {
            if (!['email', 'role', 'sex', 'CPF', 'CNPJ', 'token'].includes(item)) {
                delete validData[item];
            }
        }
        validData.role = {id: null, name: null, slug: validData.role}
        res.status(200).json({ message: 'Usuário registrado com sucesso', user: validData });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const login = async (req, res) => {
    const validData = req.validData;

    try {
        const account = await user.getUserByEmail(validData.email);
        if (!account) {
            return res.status(401).json({ message: 'Conta não encontrada' });
        }

        const passwordMatch = await bcrypt.compare(validData.password, account.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        validData.token = generatejwt({ name: validData.name, email: validData.email, role: validData.role, isAdmin: account.admin });

        res.status(200).json({
            message: 'Login bem-sucedido',
            user: {
                name: account.name,
                email: validData.email,
                role: account.role,
                sex: account.sex,
                CPF: account.cpf,
                CNPJ: account.cnpj,
                token: validData.token
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = { register, login };