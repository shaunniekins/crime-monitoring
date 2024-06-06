const mysql = require('mysql2');

// GET VALUE FROM .env FILE AND SET TO VARIABLE
const {
    DB_HOST_SECRET,
    DB_USER_SECRET,
    DB_PASSWORD_SECRET,
    DB_NAME_SECRET,
    DB_PORT_SECRET
} = process.env

const pool = mysql.createPool({
    host: DB_HOST_SECRET,
    user: DB_USER_SECRET,
    password: DB_PASSWORD_SECRET,
    database: DB_NAME_SECRET,
    port: DB_PORT_SECRET,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

module.exports = pool;