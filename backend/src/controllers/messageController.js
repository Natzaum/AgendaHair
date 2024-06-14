const messageModel = require('../models/messageModel')
const userModel = require('../models/userModel')
const JWT = require('jsonwebtoken');
require('dotenv').config();

const sendMessage = async (req, res) => {
    const validData = req.validData;
    let jwt = req.headers.authorization 
    const bearerRemover = jwt.replace('Bearer ', '');
    const decodedToken = JWT.verify(bearerRemover, process.env.JWT_SECRET_KEY);
    console.log(validData)

    let receiver_id = await userModel.getUserByEmail(validData.email)
    if (!receiver_id) {
        return res.status(404).json({ message: 'Receiver não encontrado' });
    }
    try {
        const message = await messageModel.createMessage(decodedToken.id, receiver_id.id, validData.message);
        res.status(201).json({message:'Mensagem enviada!'});
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};


const getReceivedMessagesById = async (req, res) => {
    let jwt = req.headers.authorization 
    const bearerRemover = jwt.replace('Bearer ', '');
    const decodedToken = JWT.verify(bearerRemover, process.env.JWT_SECRET_KEY);
    try {
        const messages = await messageModel.getMessagesByReceiverId(decodedToken.id);
        res.status(200).json({message:'OK', content:messages });
    } catch (error) {
        console.error('Erro ao obter mensagens recebidas:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};


module.exports = {
    sendMessage,
    getReceivedMessagesById
}