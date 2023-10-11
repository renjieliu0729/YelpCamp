const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')

router.get('/register', (req,res) => {
    res.render('users/register');
})

// user register and log in the user
router.post('/register', catchAsync(async(req,res) => {
    try {
    const{email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err=>{
        if(err) return next(err);
        req.flash('success', 'welcome you are logged in')
        res.redirect('/campgrounds')
    })
    } catch(e){
        req.flash('error',e.message)
        res.redirect('/campgrounds')
    }
}));

router.get('/login', async(req,res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), async(req,res) =>{
    req.flash('success', 'welcome back')
    res.redirect('/campgrounds')
})

// user to log out 
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 


module.exports = router;

