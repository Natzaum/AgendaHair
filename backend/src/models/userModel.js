const db = require('../database/connection');

const getUserByEmail = async (email) => {
    if (!email) throw new Error('Email is required')
    const getUserByEmail = await db.query('SELECT * FROM users WHERE email = $1', [email])

    if(!getUserByEmail){
        return false
    } else {
        return getUserByEmail.rows[0]
    }
}

const createUser = async (userData) => {
    let conta = await getUserByEmail(userData.email)

    if (conta) {
        console.log(`${conta.name} já existe`)
        return false
    }

    const result = await db.query('SELECT * FROM roles WHERE slug = $1', [userData.type]);
    const roleId = result.rows[0]; 

    const query = {
        text: 'INSERT INTO users(name, email, password, role_id, sex , cpf, cnpj,admin) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [userData.name, userData.email, userData.HashPassword, roleId.id, userData.sex, userData.CPF, userData.CNPJ, false],
    };
 
    await db.query(query); 
    
}


module.exports = {
    getUserByEmail,
    createUser
}