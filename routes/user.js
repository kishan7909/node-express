const express = require('express')

const router = express.Router()

//controllers
const {
    createUser,
    detailsUser,
    passwordUpdate,
    getUsers,
    userUpdate,
    userDelete,
    forgotPasswordEmailLink,
    resetPassword,
} = require('../controllers/user')
const { verifyAuth, forgotPasswordVerifyToken } = require('../middleware/auth')

router.put('/user/password/:id', passwordUpdate)
router.post('/user/forgot/password', forgotPasswordEmailLink)
router.post('/user/password/reset', forgotPasswordVerifyToken, resetPassword)

router.get('/user/:id', detailsUser)
router.post('/user/create', createUser)
router.put('/user/update/:id', userUpdate)
router.delete('/user/delete/:id', userDelete)

router.post('/users', getUsers)
// router.post('/users/filter', filterUsers);

module.exports = router
