const express = require('express')
const {signUp,login,forgetPassword,reset,getallUsers,editUserDetails,getOneUser} = require('../controllers/usersControllers')
const router = express.Router()

router.post('/signup',signUp)
router.get('/getAllUsers',getallUsers)
router.post('/login',login)
router.post('/forgetPassword',forgetPassword)
router.post('/resetPassword/:token',reset)
router.post('/editUserDetails',editUserDetails)
router.get('/getOneUser',getOneUser)
module.exports = router