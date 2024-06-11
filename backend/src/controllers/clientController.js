const clientModel = require('../models/clientModel')


const getLocations = async (req, res) =>{
    
    try {
        const locations = await clientModel.getLocations()

        if (locations.length == 0) {
            return res.status(404).json({message:'Nenhuma localização encontrada'})
        }
        res.status(200).json({message:'Encontrado', content:locations})
    }

    catch(err){
        console.error('Erro ao obter locations:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}


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


module.exports = {
    getLocations,
    getCategories,
    getAllServices,
    getProviderServicesById,
    getAllProviders,
}