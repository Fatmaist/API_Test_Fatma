var express = require('express')
var app = express()
const pool = require('./queries.js')
const user = require('./routes/membership/user.js')
const profile = require('./routes/membership/profile.js')
const information = require('./routes/information.js')
const transaction = require('./routes/transaction.js')
var swaggerJsdoc = require('swagger-jsdoc')
var swaggerUi = require('swagger-ui-express')
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use('', user)
app.use('', profile)
app.use('', information)
app.use('', transaction)

app.get('/', function (req, res) {
    res.send('Hello World!')
})

const option = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Contract SIMS PPOB',
            version: '1.0.0',
            description: 'API documentation for Nutech Test_by Fatma',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*/*.js'],
}

const specs = swaggerJsdoc(option)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err)
        return
    }
    console.log('Connected to the database')
})

app.listen(3000)