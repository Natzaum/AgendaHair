const { Client } = require('pg')
 
const client = new Client({
    user: 'agendahair',
    database: 'agendahair-db',
    host:'localhost',
    password: 'FOPmefpom12#',
    port: 5433,
})

client.connect()

client.on('connection', function () {
    console.error('Connected!');
});

client.on('error', function (err) {
    console.error('client error', err.message, err.stack);
});



module.exports = client
