const db = require('../database/connection');

const getUserById = async (user_id) => {
    try {
        const services = await db.query('SELECT * FROM users WHERE id = $1', [user_id])
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}


const getClientByuser_id= async (user_id) => {
    try {
        const services = await db.query('SELECT * FROM clients WHERE user_id = $1', [user_id])
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}


const getProviderByuser_id= async (user_id) => {
    try {
        const services = await db.query('SELECT * FROM professionals WHERE user_id = $1', [user_id])
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

const getProviderById= async (user_id) => {
    try {
        const services = await db.query('SELECT * FROM professionals WHERE id = $1', [user_id])
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

const getClientById = async (user_id) => {
    try {
        const services = await db.query('SELECT * FROM clients WHERE id = $1', [user_id])
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

const updateUser = async (id) => {
    try {
        let conta = getUserById(id)

        if (!conta) {
            return 'not found'
        }
     
        const values = []; //  armazenar os valores que serão passados 
        let updateString = 'UPDATE users SET '; 
    
        const addUpdateClause = (field, value) => {
            updateString += `${field} = $${values.length + 1}, `;
            values.push(value);
        };
    
        const addFieldIfPresent = (field) => {
            if (userData[field]) {
                addUpdateClause(field, userData[field]);
            }
        };
    
        addFieldIfPresent('name');
        addFieldIfPresent('email');
        addFieldIfPresent('phone');
        addFieldIfPresent('cpf');
        addFieldIfPresent('cnpj');
        addFieldIfPresent('sex');
        addFieldIfPresent('role_id');
        addFieldIfPresent('admin');
    
    
    
        updateString = updateString.slice(0, -2);
    
        updateString += ' WHERE id = $' + (values.length + 1);
        values.push(conta.id); 
    
    
        const account = await db.query(updateString, values);
        return account.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }


}

module.exports = {
    getUserById,
    updateUser,
    getClientByuser_id,
    getProviderByuser_id,
    getProviderById,
    getClientById
}