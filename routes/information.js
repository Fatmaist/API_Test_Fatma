var express = require('express')
var router = express.Router()
const pool = require('../queries.js')
var bodyParser = require('body-parser')
const auth = require('../routes/middleware/auth.js')

router.use(bodyParser.json())

router.get('/banner', (req, res) => {
    const sql = 'SELECT banner_name, banner_image, description FROM banners'
    pool.query(sql, (err, results) => {
        if (err) {
        return res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan pada server',
            data: null
        })
        }
        return res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: results
        })
    })
})

router.get('/services', auth, (req, res) => {
    const sql = 'SELECT service_code, service_name, service_icon, service_tarif FROM services'
    pool.query(sql, (err, results) => {
        if (err) {
        return res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan pada server',
            data: null
        })
        }
        return res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: results
        })
    })
})

module.exports = router