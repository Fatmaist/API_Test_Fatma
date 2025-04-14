const mysql = require('mysql')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nutech_test'
})

module.exports = pool