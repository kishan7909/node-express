const express = require('express')
const { loginUser, refreshToken } = require('../controllers/auth')

const router = express.Router()


router.post('/user/login', loginUser)
router.post('/user/refresh_token', refreshToken)

module.exports = router