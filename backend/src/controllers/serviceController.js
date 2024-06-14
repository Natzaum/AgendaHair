const providerModel = require('../models/providerModel');
const JWT = require('jsonwebtoken');
const admin = require('../models/adminModel')
const clientModel = require('../models/clientModel')
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


const deleteService = async (req, res) => {
    let serviceId = req.params.id
    const jwt = req.headers.authorization;
    const bearerRemover = jwt.replace('Bearer ', '');
    const decodedToken = JWT.verify(bearerRemover, process.env.JWT_SECRET_KEY);

    try {
        await providerModel.deleteService(serviceId);
        res.status(200).json({ message: 'Serviço deletado' });
    } catch (error) {
        console.error('Erro ao criar serviço e localização:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};


const deleteSchedule = async (req, res) => {
    let scheduleId = req.params.id
    const jwt = req.headers.authorization;
    const bearerRemover = jwt.replace('Bearer ', '');
    const decodedToken = JWT.verify(bearerRemover, process.env.JWT_SECRET_KEY);

    try {
        await providerModel.deleteSchedule(scheduleId);
        res.status(200).json({ message: 'Agendamento cancelado' , allSchedule});
    } catch (error) {
        console.error('Erro ao criar serviço e localização:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};



const getAllServices = async (req, res) =>{
    try {
        const services = await clientModel.getAllServices()
        
        if (services.length == 0) {
            return res.status(404).json({message:'Nenhum serviço encontrada'})
        }

        res.status(200).json({message:'Serviços disponiveis', content:services})
    }

    catch(err){
        console.error('Erro ao obter services:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

module.exports = {
    createServiceWithLocation,
    deleteService,
    getAllServices,
    deleteSchedule
};
