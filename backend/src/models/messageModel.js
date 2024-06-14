const db = require('../database/connection');
const adminModel = require('./adminModel')

const createMessage = async (sender_id, receiver_id, content) => {
    try {
        const query = 'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)';
        const values = [sender_id, receiver_id, content];
        await db.query(query, values);
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
};


const getMessagesByReceiverId = async (receiver_id) => {
    try {
        const query = 'SELECT * FROM messages WHERE receiver_id = $1 ORDER BY sent_at DESC';
        const result = await db.query(query, [receiver_id]);
        for (const message of result.rows) {
            let sender = await adminModel.getUserById(message.sender_id)
            message.sender = {name:sender[0].name, email:sender[0].email}
        
        }
        return result.rows;
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }

};


module.exports = {
    createMessage,
    getMessagesByReceiverId
}