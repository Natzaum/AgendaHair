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

module.exports = {
    getLocations
}