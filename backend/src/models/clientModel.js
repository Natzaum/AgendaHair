const db = require('../database/connection')
const admin = require('./adminModel')

const getLocations = async () => {
    try {
        const locations = await db.query('SELECT * FROM locations')
        return locations.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

const getTotalPrice = async (ids) => {
    try {
        const total = await db.query('SELECT calculate_total_price($1::int[])', [ids])
        return total.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

const getLocationById = async (location_id) => {
    try {
        const services = await db.query('SELECT * FROM locations WHERE id = $1', [location_id])
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

const getAllServices = async () => {
    try {
        const services = await db.query('SELECT * FROM services')
        for (const service of services.rows) {
            console.log(service)
            let provider = await admin.getUserById(service.provider_id)
            service.provider = {name:provider[0].name}

            let category = await getCategoryById(service.category_id)
            service.category = {name:category[0].name, slug:category[0].slug, description:category[0].description}

            let location = await getLocationById(service.location_id)
            service.location = {name:location[0].name, city:location[0].city, state:location[0].state}

        }
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

const getAllProviders = async () => {
    try {
        const providers = await db.query('SELECT * FROM professionals')
        for (const provider of providers.rows) {
            let user = await admin.getUserById(provider.user_id)
            provider.provider = {name:user[0].name, email:user[0].email, phone:user[0].phone, cnpj:user[0].cnpj, sex:user[0].sex}
        }
        return providers.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}


const getAllCategories = async () => {
    try {
        const services = await db.query('SELECT * FROM service_categories')
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}


const getCategoryById = async (category_id) => {
    try {
        const services = await db.query('SELECT * FROM service_categories WHERE id = $1', [category_id])
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

const getServiceById = async (service_id) => {
    try {
        const services = await db.query('SELECT * FROM services WHERE id = $1', [service_id])
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}


const createScheduleService = async (service_id, client_id, provider_id,schedule_date) => {
    try {
        const query = `
        INSERT INTO schedules (service_id, client_id, provider_id ,schedule_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;
        const values = [service_id, client_id, provider_id,schedule_date];

        const result = await db.query(query, values);
        return result.rows[0]
        }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}


const getScheduleServices = async (client_id, role) => {
    try {
        // Verifica se o valor de role é válido
        const validRoles = ['client_id', 'provider_id']; // Lista de colunas permitidas
        if (!validRoles.includes(role)) {
            throw new Error('Invalid role');
        }

        // Monta a query usando o valor seguro de role
        const query = `SELECT * FROM schedules WHERE ${role} = $1`;
        const values = [client_id];

        const result = await db.query(query, values);

        for (const schedules of result.rows) {
            let service = await getServiceById(schedules.service_id);
            schedules.service = service[0];

            let provider = await admin.getProviderById(service[0].provider_id);
            let user = await admin.getUserById(provider[0].user_id);
            schedules.service.provider = { name: user[0].name, email: user[0].email };

            let client = await admin.getClientById(schedules.client_id);
            let userClient = await admin.getUserById(client[0].user_id);

            schedules.client = { name: userClient[0].name, email: userClient[0].email };
        }
        return result.rows;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

const getProviderServicesById = async (provider_id) => {
    try {
        const services = await db.query('SELECT * FROM services WHERE provider_id = $1', [provider_id])
        for (const service of services.rows) {
            let provider = await admin.getUserById(service.provider_id)
            service.provider = {name:provider[0].name, email:provider[0].email}

            let category = await getCategoryById(service.category_id)
            service.category = category

            let location = await getLocationById(service.location_id)
            service.location = location

        }
        return services.rows
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}


module.exports = {
    getLocations,
    getAllServices,
    getProviderServicesById,
    getCategoryById,
    getAllProviders,
    getAllCategories,
    getServiceById,
    createScheduleService,
    getScheduleServices,
    getTotalPrice
}