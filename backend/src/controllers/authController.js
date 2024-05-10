const bcrypt = require('bcrypt');
const db = require('../database/connection');
const { validationResult } = require('express-validator');
const { matchedData } = require('express-validator');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extrair dados válidos do corpo da requisição
    const validData = matchedData(req);
    console.log('Register Endpoint!')


    const hashedPassword = await bcrypt.hash(validData.password, 10);
    
    try {
        const result = await db.query('SELECT * FROM roles WHERE slug = $1', [validData.type]);
        const roleId = result.rows[0]; 


        const query = {
            text: 'INSERT INTO users(name, email, password, roleid, sex, genre, cpf, cnpj) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
            values: [validData.name, validData.email, hashedPassword, roleId.id, validData.sex, validData.genre, validData.CPF, validData.CNPJ],
          };
          
        const response = await db.query(query);        
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

        const result = await db.query('SELECT * FROM users WHERE email = $1', [validData.email]);
        const user = result.rows[0]; // O primeiro usuário encontrado com o e-mail fornecido

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

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