const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users')

router.get('/register', users.renderRegister);

// user register and log in the user
router.post('/register', catchAsync(users.register));

// login page
router.get('/login', users.renderLoginForm);


// user to log in the action
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), users.login)


// user to log out 
router.get('/logout', users.logout); 


module.exports = router;

