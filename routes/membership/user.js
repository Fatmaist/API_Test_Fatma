var express = require('express')
var router = express.Router()
const pool = require('../../queries.js')
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

router.use(bodyParser.json())

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Registration:
 *       type: object
 *       required:
 *         - email
 *         - first_name
 *         - last_name
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email address
 *           example: user@nutech-integrasi.com
 *         first_name:
 *           type: string
 *           description: First name
 *           example: User
 *         last_name:
 *           type: string
 *           description: Last name
 *           example: Nutech
 *         password:
 *           type: string
 *           description: Password
 *           example: abcdef1234
 *
 * /registration:
 *   post:
 *     summary:
 *     tags:
 *       - 1. Module Membership
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Registrasi berhasil silahkan login
 *                 data:
 *                   type: string
 *                   example: null
*       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: Parameter email tidak sesuai format
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email address
 *           example: user@nutech-integrasi.com
 *         password:
 *           type: string
 *           description: Password
 *           example: abcdef1234
 *
 * /login:
 *   post:
 *     summary: 
 *     tags:
 *       - 1. Module Membership
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Berhasil Login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Login Sukses
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNTRVdXRjYTdCS0ZPX0ZUZGZ1bXlJem9zSTRKa1VxUGZVZ0ROSTUwelRTQlo2aHoyY0hKZ1VMb1loM09HUUd0ekQxV3dTX194aHBNZTE2SGFscVRzcEhjS21UclJ3S2FYYmZob3AzdzFFUHJ2NFdBQmk1c0RpdV9DSnZTSWt2MDFTbEU0QU5pbVB0bUx5azZoUzlOalVQNEZaVVpfRVBtcEk4Y3pNc3ZWa2JFPSIsImlhdCI6MTYyNjkyODk3MSwiZXhwIjoyNTU2MTE4Nzk4fQ.9C9NvhZYKivhGWnrjo4Wr1Rv-wur1wCm0jqfK9XDD8U
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: Parameter email tidak sesuai format
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 103
 *                 message:
 *                   type: string
 *                   example: Username atau password salah
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary:
 *     tags:
 *       - 1. Module Membership
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Sukses
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@nutech-integrasi.com
 *                     first_name:
 *                       type: string
 *                       example: User
 *                     last_name:
 *                       type: string
 *                       example: Nutech
 *                     profile_image:
 *                       type: string
 *                       example: https://localhost:3000/profile.jpeg
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: Token tidak valid atau kadaluwarsa
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /profile/update:
 *   put:
 *     summary:
 *     tags:
 *       - 1. Module Membership
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: User Edited
 *               last_name:
 *                 type: string
 *                 example: Nutech Edited
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Update Profile berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@nutech-integrasi.com
 *                     first_name:
 *                       type: string
 *                       example: User Edited
 *                     last_name:
 *                       type: string
 *                       example: Nutech Edited
 *                     profile_image:
 *                       type: string
 *                       example: https://yoururlapi.com/profile.jpeg
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: Token tidak valid atau kadaluwarsa
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /profile/image:
 *   put:
 *     summary: 
 *     tags:
 *       - 1. Module Membership
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Update Profile Image berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@nutech-integrasi.com
 *                     first_name:
 *                       type: string
 *                       example: User Edited
 *                     last_name:
 *                       type: string
 *                       example: Nutech Edited
 *                     profile_image:
 *                       type: string
 *                       example: https://localhost:3000/profile-updated.jpeg
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: Format Image tidak sesuai
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: Token tidak valid atau kadaluwarsa
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /banner:
 *   get:
 *     summary:
 *     tags:
 *       - 2. Module Information
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Sukses
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       banner_name:
 *                         type: string
 *                         example: Banner 1
 *                       banner_image:
 *                         type: string
 *                         example: https://nutech-integrasi.app/dummy.jpg
 *                       description:
 *                         type: string
 *                         example: Lerem Ipsum Dolor sit amet
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: Token tidak tidak valid atau kadaluwarsa
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: 
 *     tags:
 *       - 2. Module Information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Sukses
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       service_code:
 *                         type: string
 *                         example: "PAJAK"
 *                       service_name:
 *                         type: string
 *                         example: "Pajak PBB"
 *                       service_icon:
 *                         type: string
 *                         example: "https://nutech-integrasi.app/dummy.jpg"
 *                       service_tariff:
 *                         type: integer
 *                         example: 40000
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: Token tidak valid atau kadaluwarsa
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: 
 *     tags:
 *       - 2. Module Information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Sukses
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       service_code:
 *                         type: string
 *                         example: "PAJAK"
 *                       service_name:
 *                         type: string
 *                         example: "Pajak PBB"
 *                       service_icon:
 *                         type: string
 *                         example: "https://nutech-integrasi.app/dummy.jpg"
 *                       service_tariff:
 *                         type: integer
 *                         example: 40000
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: Token tidak valid atau kadaluwarsa
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /balance:
 *   get:
 *     summary:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get Balance / Saldo Berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Sukses
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: integer
 *                       example: 2144701001
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: Token tidak valid atau kadaluwarsa
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /topup:
 *   post:
 *     summary:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               top_up_amount:
 *                 type: integer
 *                 example: 100000
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Top Up Balance berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: integer
 *                       example: 2000000
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: Token tidak tidak valid atau kadaluwarsa
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_code:
 *                 type: string
 *                 example: PULSA
 *     responses:
 *       200:
 *         description: Transaksi Berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Transaksi berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice_number:
 *                       type: string
 *                       example: INV17082023-001
 *                     service_code:
 *                       type: string
 *                       example: PLN_PRABAYAR
 *                     service_name:
 *                       type: string
 *                       example: PLN Prabayar
 *                     transaction_type:
 *                       type: string
 *                       example: PAYMENT
 *                     total_amount:
 *                       type: integer
 *                       example: 10000
 *                     created_on:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-08-17T10:10:10.000Z
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: Service ataus Layanan tidak ditemukan
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: Token tidak tidak valid atau kadaluwarsa
 *                 data:
 *                   type: string
 *                   example: null
 */

/**
 * @swagger
 * /transaction/history:
 *   get:
 *     summary:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: offset
 *         in: query
 *         description: Offset untuk mulai mengambil data
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: Jumlah data yang ingin diambil
 *         required: false
 *         schema:
 *           type: integer
 *           default: 3
 *     responses:
 *       200:
 *         description: Get History Transaksi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Get History Berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     offset:
 *                       type: string
 *                       example: "0"
 *                     limit:
 *                       type: string
 *                       example: "3"
 *                     records:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           invoice_number:
 *                             type: string
 *                             example: INV17082023-001
 *                           transaction_type:
 *                             type: string
 *                             example: TOPUP
 *                           description:
 *                             type: string
 *                             example: Top Up balance
 *                           total_amount:
 *                             type: integer
 *                             example: 100000
 *                           created_on:
 *                             type: string
 *                             format: date-time
 *                             example: 2023-08-17T10:10:10.000Z
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: Token tidak valid atau kadaluwarsa
 *                 data:
 *                   type: string
 *                   example: null
 */

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

router.post('/registration', (req, res) => {
    const { email, first_name, last_name, password } = req.body
    console.log(req.body)

    if (!email || !first_name || !last_name || !password) {
        return res.status(400).json({
            message: 'Please fill all the fields',
        })
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({
            status: 102,
            message: 'Parameter email tidak sesuai format',
            data: null
        })
    }

    const checkEmailSql = 'SELECT * FROM users WHERE email = ?'
    pool.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Terjadi kesalahan pada server',
                data: null
            })
        }
        if (results.length > 0) {
            return res.status(400).json({
                status: 102,
                message: 'Email sudah terdaftar',
                data: null
            })
        }

        const sql = 'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)'
        const values = [email, first_name, last_name, password]
        pool.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Terjadi kesalahan saat menyimpan data',
                    data: null
                })
            }

            return res.status(200).json({
                status: 0,
                message: 'Registrasi berhasil silahkan login',
                data: null
            })
        })
    })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            status: 102,
            message: 'Parameter email tidak sesuai format',
            data: null
        })
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({
            status: 102,
            message: 'Parameter email tidak sesuai format',
            data: null
        })
    }

    if (password.length < 8) {
        return res.status(400).json({
            status: 102,
            message: 'Password minimal 8 karakter',
            data: null
        })
    }

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?'
    pool.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Terjadi kesalahan pada server',
                data: null
            })
        }

        if (results.length === 0) {
            return res.status(401).json({
                status: 103,
                message: 'Username atau password salah',
                data: null
            })
        }

        const payload = { email }
        const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, { expiresIn: '12h' })

        return res.status(200).json({
            status: 0,
            message: 'Login Sukses',
            data: {
                token: token
            }
        })
    })
})

module.exports = router