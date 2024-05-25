const db = require('../database/connection');

const getUserByEmail = async (email) => {
    const getUserByEmail = await db.query('SELECT * FROM users WHERE email = $1', [email])

    if(!email){
        return 'conta inexistente'
    } else {
        return getUserByEmail.rows[0]
    }
}

const createUser = async (userData) => {
    let conta = await user.getUserByEmail(validData.email)

    if (conta) {
        return res.json({message:'existe'})
    }

    const result = await db.query('SELECT * FROM roles WHERE slug = $1', [validData.type]);
    const roleId = result.rows[0]; 

    const query = {
        text: 'INSERT INTO users(name, email, password, roleid, sex, genre, cpf, cnpj) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [validData.name, validData.email, hashedPassword, roleId.id, validData.sex, validData.genre, validData.CPF, validData.CNPJ],
    };

    const response = await db.query(query);   
    
}

module.exports = {
    getUserByEmail,
    createUser
}