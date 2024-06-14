const db = require('../database/connection');

const createLocation = async (locationData) => {
    try {
        const query = `
            INSERT INTO locations (name, street, cep, city, state, number, available_days, open_time, close_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
        const values = [
            locationData.name, 
            locationData.street, 
            locationData.cep, 
            locationData.city, 
            locationData.state, 
            locationData.number, 
            locationData.available_days, 
            locationData.open_time, 
            locationData.close_time
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

const createService = async (serviceData) => {
    try {
        const query = `
            INSERT INTO services (name, category_id, price, provider_id, location_id, description, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [
            serviceData.name,
            serviceData.category_id,
            serviceData.price,
            serviceData.provider_id,
            serviceData.location_id,
            serviceData.description,
            serviceData.status
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

module.exports = {
    createLocation,
    createService,
};
