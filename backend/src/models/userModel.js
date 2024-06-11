const db = require('../database/connection');


const getRoleById = async (role_id) => {
    try {
        const role = await db.query('SELECT * FROM roles WHERE id = $1', [role_id])
        return role.rows[0]
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}


const getUserByEmail = async (email) => {
    if (!email) throw new Error('Email is required')
    const getUserByEmail = await db.query('SELECT * FROM users WHERE email = $1', [email])

    if(getUserByEmail.rows.length == 0){
        return false
    } else {
        let user = getUserByEmail.rows[0]
        let role = await getRoleById(user.role_id)
        user.role = role
        return user
    }
}

const createUser = async (userData) => {
    let conta = await getUserByEmail(userData.email)

    if (conta) {
        console.log(`${conta.name} já existe`)
        return false
    }

    const result = await db.query('SELECT * FROM roles WHERE slug = $1', [userData.role]);
    const roleId = result.rows[0]; 
    
    
    const query = {
        text: 'INSERT INTO users(name, email, password, role_id, sex , cpf, cnpj, admin) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        values: [userData.name, userData.email, userData.HashPassword, roleId.id, userData.sex, userData.CPF, userData.CNPJ, false],
    };
        
    let user = await db.query(query); 
    let userId = user.rows[0].id;

    let role = await getRoleById(roleId.id)

    const insert = {
        text: `INSERT INTO ${role.ref}(user_id, available, observations) VALUES($1, $2, $3)`,
        values: [userId, true, 'OK'],
    };

    await db.query(insert); 
    
    }


module.exports = {
    getUserByEmail,
    createUser
}