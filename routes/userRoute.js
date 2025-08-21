const express = require('express');
const { loginController, registerController } = require('../controllers/userController');

//router object
const router = express.Router();

//routers
//post rout or login
router.post('/login',loginController)

//post or register user
router.post('/register',registerController)

module.exports = router