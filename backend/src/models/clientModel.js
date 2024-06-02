const db = require('../database/connection')


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
            let provider = await getUserById(service.provider_id)
            service.provider = {name:provider[0].name}

            let category = await getCategoryById(service.category_id)
            service.category = {name:category[0].name, slug:category[0].slug, slug:category[0].description}

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
            let user = await getUserById(provider.user_id)
            provider.provider = {name:user[0].name, email:user[0].email, phone:user[0].phone, cnpj:user[0].cnpj, sex:user[0].sex}
        }
        return providers.rows
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



const getProviderServicesById = async (provider_id) => {
    try {
        const services = await db.query('SELECT * FROM services WHERE provider_id = $1', [provider_id])
        for (const service of services.rows) {
            let provider = await getUserById(service.provider_id)
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
    getAllProviders
}