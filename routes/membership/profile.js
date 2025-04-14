require('dotenv').config()
var express = require('express')
var router = express.Router()
const pool = require('../../queries.js')
var bodyParser = require('body-parser')
const auth = require('../middleware/auth.js')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

router.use(bodyParser.json())

router.get('/profile', auth, (req, res) => {
    const email = req.user.email

    const sql = 'SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?'
    pool.query(sql, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({
                status: 108,
                message: 'User tidak ditemukan',
                data: null
            })
        }

        const user = results[0]

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image
            }
        })
    })
})

router.put('/profile/update', auth, (req, res) => {
    const { first_name, last_name } = req.body
    const email = req.user.email

    if (!first_name || !last_name) {
        return res.status(400).json({
            status: 102,
            message: 'First name dan last name harus diisi',
            data: null
        })
    }

    const sql = 'UPDATE users SET first_name = ?, last_name = ? WHERE email = ?'
    pool.query(sql, [first_name, last_name, email], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Terjadi kesalahan saat memperbarui data',
                data: null
            })
        }

        if (result.affectedRows === 0) {
            return res.status(401).json({
                status: 108,
                message: 'User tidak ditemukan',
                data: null
            })
        }

        const User = 'SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?'
        pool.query(User, [email], (err, results) => {
            if (err || results.length === 0) {
                return res.status(500).json({
                    status: 500,
                    message: 'Terjadi kesalahan saat mengambil data pengguna',
                    data: null
                })
            }

            const user = results[0]
            const updatedData = {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image
            }

            return res.status(200).json({
                status: 0,
                message: 'Update Profile berhasil',
                data: updatedData
            })
        })
    })
})

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads')
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + path.extname(file.originalname)
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const mime = file.mimetype.toLowerCase()
    const allowedExts = ['.jpg', '.jpeg', '.png']
    const allowedMimes = ['image/jpeg', 'image/png']
    const isValidExt = allowedExts.includes(ext)
    const isValidMime = allowedMimes.includes(mime)
    if (isValidExt && isValidMime) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('file')

router.put('/profile/image', auth, (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.status(400).json({
                status: 102,
                message: 'Format Image tidak sesuai',
                data: null
            })
        }

        if (!req.file) {
            return res.status(400).json({
                status: 102,
                message: 'Format Image tidak sesuai',
                data: null
            })
        }

        const email = req.user.email
        const profileImage = `https://localhost:3000/uploads/${req.file.filename}`
        const sql = 'UPDATE users SET profile_image = ? WHERE email = ?'

        pool.query(sql, [profileImage, email], (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Terjadi kesalahan saat memperbarui data',
                    data: null
                })
            }

            if (result.affectedRows === 0) {
                return res.status(401).json({
                    status: 108,
                    message: 'User tidak ditemukan',
                    data: null
                })
            }

            const updatedData = {
                email,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                profile_image: profileImage
            }

            return res.status(200).json({
                status: 0,
                message: 'Update Profile Image berhasil',
                data: updatedData
            })
        })
    })
})

module.exports = router