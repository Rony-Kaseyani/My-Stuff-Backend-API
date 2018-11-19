const router = require('express').Router()
const user = require('../models/user')
const passport = require('passport')

router.get('/register', (req, res) => res.render('user-registration-form'))

router.get('/login', (req, res) => res.render('login-form'))

router.get('/dashboard', isLoggedIn, (req, res) => res.render('/'))

router.get('/logout', (req, res) => res.render('/'))

router.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',

    failureRedirect: '/register'
}

))

router.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/dashboard',

    failureRedirect: '/login'
}

))

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())

        return next();

    res.redirect('/login');

}

module.exports = router
