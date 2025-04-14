var express = require('express')
var router = express.Router()
const pool = require('../queries.js')
var bodyParser = require('body-parser')
const auth = require('../routes/middleware/auth.js')

router.use(bodyParser.json())

router.get('/balance', auth, (req, res) => {
    const sql = 'SELECT balance FROM users'
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

const generateUniqueTopUpNumber = (callback) => {
    const tryGenerate = () => {
        const topUpNumber = Math.floor(1000000000 + Math.random() * 9000000000)
        const checkQuery = 'SELECT 1 FROM top_up WHERE top_up_number = ? LIMIT 1'
        pool.query(checkQuery, [topUpNumber], (err, result) => {
            if (err) return callback(err, null)
            if (result.length > 0) {
                return tryGenerate()
            } else {
                return callback(null, topUpNumber)
            }
        })
    }
    tryGenerate()
}

router.post('/topup', auth, (req, res) => {
    const { top_up_amount } = req.body
    const email = req.user.email

    if (!top_up_amount || isNaN(top_up_amount) || parseInt(top_up_amount) < 0) {
        return res.status(400).json({
        status: 102,
        message: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
        data: null
        })
    }

    const parsedAmount = parseInt(top_up_amount)

    const getUserQuery = 'SELECT id_user, balance FROM users WHERE email = ?'
    pool.query(getUserQuery, [email], (err, result) => {
        if (err || result.length === 0) {
        return res.status(500).json({
            status: 500,
            message: 'Gagal mengambil data pengguna',
            data: null
        })
    }

    const id_user = result[0].id_user
    const currentBalance = result[0].balance
    const updatedBalance = currentBalance + parsedAmount

    const updateBalanceQuery = 'UPDATE users SET balance = ? WHERE id_user = ?'
    pool.query(updateBalanceQuery, [updatedBalance, id_user], (err) => {
        if (err) {
            return res.status(500).json({
            status: 500,
            message: 'Gagal memperbarui saldo',
            data: null
            })
        }

        const generateUniqueTopUpNumber = (callback) => {
        const topUpNumber = Math.floor(1000000000 + Math.random() * 9000000000)
        const checkQuery = 'SELECT 1 FROM top_up WHERE top_up_number = ? LIMIT 1'
        pool.query(checkQuery, [topUpNumber], (err, result) => {
            if (err) return callback(err, null)
            if (result.length > 0) {
                return generateUniqueTopUpNumber(callback)
            } else {
                return callback(null, topUpNumber)
            }
            })
        }

        const insertTopUp = (topUpNumber, retry = 3) => {
            const insertTopUpQuery = 'INSERT INTO top_up (top_up_number, id_user, top_up_amount, total_amount) VALUES (?, ?, ?, ?)'
            pool.query(insertTopUpQuery, [topUpNumber, id_user, parsedAmount, updatedBalance], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY' && retry > 0) {
                return generateUniqueTopUpNumber((err, newTopUpNumber) => {
                    if (err) {
                    return res.status(500).json({
                        status: 500,
                        message: 'Gagal menghasilkan top up number',
                        data: null
                    })
                    }
                    return insertTopUp(newTopUpNumber, retry - 1)
                })
                }
                return res.status(500).json({
                status: 500,
                message: 'Gagal menyimpan data top up',
                data: null
                })
            }

            return res.status(200).json({
                status: 0,
                message: 'Top Up Balance berhasil',
                data: {
                balance: updatedBalance
                }
            })
            })
        }

        generateUniqueTopUpNumber((err, topUpNumber) => {
            if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Gagal menghasilkan nomor top up number',
                data: null
            })
            }

            insertTopUp(topUpNumber)
        })
        })
    })
})

router.post('/transaction', auth, async (req, res) => {
    const { service_code } = req.body
    const email = req.user.email

    if (!service_code) {
        return res.status(400).json({
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
        data: null
        })
    }

    pool.query('SELECT id_user, balance FROM users WHERE email = ?', [email], (err, users) => {
        if (err || users.length === 0) {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak tidak valid atau kadaluwarsa',
            data: null
        })
        }

    const id_user = users[0].id_user
    const currentBalance = users[0].balance

    pool.query('SELECT * FROM services WHERE service_code = ?', [service_code], (err, services) => {
        if (err || services.length === 0) {
            return res.status(400).json({
            status: 102,
            message: 'Service ataus Layanan tidak ditemukan',
            data: null
            })
        }

        const service = services[0]
        const tarif = service.service_tarif

        if (currentBalance < tarif) {
            return res.status(400).json({
            status: 102,
            message: 'Saldo tidak mencukupi',
            data: null
            })
        }

        const updatedBalance = currentBalance - tarif
        const invoiceNumber = 'INV' + Date.now()

        pool.query('UPDATE users SET balance = ? WHERE id_user = ?', [updatedBalance, id_user], (err) => {
            if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Gagal memperbarui saldo',
                data: null
            })
        }

        pool.query(
            'INSERT INTO transaction (invoice_number, service_code, id_user, transaction_type, total_amount) VALUES (?, ?, ?, ?, ?)',
            [invoiceNumber, service_code, id_user, 'PAYMENT', tarif],
            (err) => {
                if (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Gagal menyimpan transaksi',
                    data: null
                })
            }

            return res.status(200).json({
                status: 0,
                message: 'Transaksi berhasil',
                data: {
                    invoice_number: invoiceNumber,
                    service_code: service.service_code,
                    service_name: service.service_name,
                    transaction_type: 'PAYMENT',
                    total_amount: tarif,
                    created_on: new Date().toISOString()
                }
                })
            })
        })
        })
    })
})

router.get('/transaction/history', auth, (req, res) => {
    const offset = req.query.offset
    const limit = req.query.limit
    const email = req.user.email

    if (!email) {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak valid atau kadaluwarsa',
            data: null
        })
    }

    console.log('Email:', email)

    const selectUserId = 'SELECT id_user FROM users WHERE email = ?'

    pool.query(selectUserId, [email], (err, result) => {
        if (err) {
            console.error('Error fetching user ID:', err)
            return res.status(500).json({
                status: 500,
                message: 'Gagal menemukan pengguna berdasarkan email',
                data: null
            })
        }

        if (result.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Pengguna tidak ditemukan',
                data: null
            })
        }

        const id_user = result[0].id_user
        console.log('User ID:', id_user)

        let query = `
            SELECT t.invoice_number, t.transaction_type, s.service_name AS description, t.total_amount, t.created_on
            FROM transaction t
            JOIN services s ON t.service_code = s.service_code
            WHERE t.id_user = ?
            ORDER BY t.created_on DESC`
        
        if (limit) {
            query += ' LIMIT ?'
        }

        if (offset) {
            query += ' OFFSET ?'
        }

        const queryParams = [id_user]
        if (limit) queryParams.push(parseInt(limit)) 
        if (offset) queryParams.push(parseInt(offset))

        console.log('Executing query with params:', queryParams)

        pool.query(query, queryParams, (err, result) => {
            if (err) {
                console.error('Error fetching transactions:', err)
                return res.status(500).json({
                    status: 500,
                    message: 'Gagal mengambil data transaksi',
                    data: null
                })
            }

            if (result.length === 0) {
                return res.status(200).json({
                    status: 0,
                    message: 'Tidak ada transaksi ditemukan',
                    data: {
                        offset: offset || '0',
                        limit: limit || '3',
                        records: []
                    }
                })
            }

            return res.status(200).json({
                status: 0,
                message: 'Get History Berhasil',
                data: {
                    offset: offset || '0',
                    limit: limit || '3',
                    records: result.map(record => ({
                        invoice_number: record.invoice_number,
                        transaction_type: record.transaction_type,
                        description: record.description,
                        total_amount: record.total_amount,
                        created_on: record.created_on
                    }))
                }
            })
        })
    })
})

module.exports = router