const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Krumovgrad19!',
    database: 'employees'
});

client.connect();

module.exports = client;
