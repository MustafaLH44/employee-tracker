const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

client.connect();

module.exports = client;
