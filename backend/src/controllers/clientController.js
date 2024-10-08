const clientModel = require('../models/clientModel')
const JWT = require('jsonwebtoken');
const admin = require('../models/adminModel')



const getCategories = async (req, res) =>{
    
    try {
        const categories = await clientModel.getAllCategories()

        if (categories.length == 0) {
            return res.status(404).json({message:'Nenhuma categoria encontrada'})
        }
        res.status(200).json({message:'Encontrado', content:categories})
    }

    catch(err){
        console.error('Erro ao obter categories:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}




const getAllProviders = async (req, res) =>{
    try {
        const providers = await clientModel.getAllProviders()
        
        if (providers.length == 0) {
            return res.status(404).json({message:'Nenhum prestador encontrado'})
        }

        res.status(200).json({message:'Prestadores de serviços', content:providers})
    }

    catch(err){
        console.error('Erro ao obter prestadores:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}


const getProviderServicesById = async (req, res) =>{
    let providerId = req.params.id
    try {
        const services = await clientModel.getProviderServicesById(providerId)

        if (services.length == 0) {
            return res.status(404).json({message:'Nenhum serviço encontrado'})
        }
        res.status(200).json({message:'Serviços disponiveis', content:services})
    }

    catch(err){
        console.error('Erro ao obter services:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
const contactServiceById = async (req, res) =>{
    let serviceId = req.params.id
    let validData = req.validData
    let jwt = req.headers.authorization 
    const bearerRemover = jwt.replace('Bearer ', '');
    const decodedToken = JWT.verify(bearerRemover, process.env.JWT_SECRET_KEY);
    try {
        const services = await clientModel.getServiceById(serviceId)

        if (services.length == 0) {
            return res.status(404).json({message:`O serviço de id ${serviceId} não foi encontrado`})
        }

        const user = await admin.getClientByuser_id(decodedToken.id)
        let agendaAtual = await clientModel.getScheduleServices(user[0].id, 'client_id')
        
        for (let servico of agendaAtual) {
            if (servico.service_id == serviceId) {
                return res.status(403).json({message:'O cliente já solicitou esse serviço'})
            }
        }

        const schedule = await clientModel.createScheduleService(serviceId, user[0].id, services[0].provider_id,validData.schedule_date)

        res.status(200).json({message:'Agendado com sucesso!', content:schedule})
    }

    catch(err){
        console.error('Erro ao obter services:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}


const getContactedServices = async (req, res) =>{
    let jwt = req.headers.authorization 
    const bearerRemover = jwt.replace('Bearer ', '');
    const decodedToken = JWT.verify(bearerRemover, process.env.JWT_SECRET_KEY);
    try {
        let user;
        let role;
        if (decodedToken.role == 'PROVIDER') {
            user = await admin.getProviderByuser_id(decodedToken.id)
            role = 'provider_id'
        }
        if (decodedToken.role == 'CLIENT') {
            user = await admin.getClientByuser_id(decodedToken.id)
            role = 'client_id'
        }
        console.log(user[0].id, role)
        
        const contactedServices = await clientModel.getScheduleServices(user[0].id, role)
        let totalPrice
        const serviceIDS = []
        for (let i = 0; i < contactedServices.length; i++) {
            serviceIDS.push(contactedServices[i].service_id)
        }
        console.log(serviceIDS)
        
        totalPrice = await clientModel.getTotalPrice(serviceIDS)

        res.status(200).json({message:'Agenda', content:contactedServices, totalPrice:totalPrice})
    }

    catch(err){
        console.error('Erro ao obter services:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}


module.exports = {
    getCategories,
    getProviderServicesById,
    getAllProviders,
    contactServiceById,
    getContactedServices
}