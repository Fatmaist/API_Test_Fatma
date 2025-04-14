require('dotenv').config()
const jwt = require('jsonwebtoken')

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT

function auth(req, res, next) {
    const auth = req.headers.authorization
    const token = auth && auth.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak valid atau kadaluwarsa',
            data: null
        })
    }

    jwt.verify(token, SECRET_KEY_JWT, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            })
        }
        req.user = decoded
        next()
    })
}

module.exports = auth