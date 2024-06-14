const providerModel = require('../models/providerModel');
const JWT = require('jsonwebtoken');
const admin = require('../models/adminModel')
require('dotenv').config();

const createServiceWithLocation = async (req, res) => {
    const validData = req.validData;
    const jwt = req.headers.authorization;
    const bearerRemover = jwt.replace('Bearer ', '');
    const decodedToken = JWT.verify(bearerRemover, process.env.JWT_SECRET_KEY);

    try {
        const locationData = {
            name: `Salão CEP ${validData.numero}`,
            street: validData.street,
            cep: validData.cep,
            city: validData.city,
            state: validData.state,
            number: validData.numero,
            available_days: validData['available_days'],
            open_time: validData.open_time,
            close_time: validData.close_time
        };

        const location = await providerModel.createLocation(locationData);
        const user = await admin.getProviderByuser_id(decodedToken.id)
        console.log(user);

        const serviceData = {
            name: validData.name,
            category_id: validData.category,
            price: validData.price,
            provider_id: user[0].id, 
            location_id: location.id,
            description: validData.description,
            status: 'active'
        };

        const service = await providerModel.createService(serviceData);

        res.status(201).json({ message: 'Serviço e localização criados com sucesso!', location, service });
    } catch (error) {
        console.error('Erro ao criar serviço e localização:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = {
    createServiceWithLocation,
};
