/*jshint esversion: 6 */

const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/user.model')

const bcrypt = require('bcryptjs')
const bcryptSalt = 10

// Sign up Form
router.get('/signup', (req, res, next) => res.render('auth/auth-signup'))

// Sign up Form Management
router.post('/signup', (req, res, next) => {

    const { username, password, name } = req.body

    if (!username || !password || !name) {
        res.render('auth/auth-signup', { errorMsg: 'Por favor, rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {
            if (theUser) {
                res.render('auth/auth-signup', { errorMsg: 'Nombre de usuario ya registrado.' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass, name })
                .then(() => res.render('welcome'))
                .catch(() => res.render('auth/auth-signup', { errorMsg: 'Error. Contacta con un administrador de IronHack.' }))
            
        })

        .catch(err => next(err))
    
})

// Login Form - Company
router.get('/company/login', (req, res, next) => res.render('company/company-login', { errorMsg: req.flash('error') }))

// Login Form Management - Company
router.post('/company/login', passport.authenticate('local', {
    successRedirect: '/company/private-company',
    failureRedirect: '/auth/company/login',
    failureFlash: true,
    passReqToCallback: true
}))

// Logout - Company
router.get('/company/logout', (req, res) => {
    req.logout()
    res.redirect('/auth/company/login')
})

// Login Form - Schools
router.get('/academy/login', (req, res, next) => res.render('academy/academy-login', { errorMsg: req.flash('error') }))

// Login Form Management 
router.post('/academy/login', passport.authenticate('local', {
    successRedirect: '/academy/private-academy', //are-privada/perfil
    failureRedirect: '/auth/academy/login',
    failureFlash: true,
    passReqToCallback: true
}))

// Logout - Schools
router.get('/academy/logout', (req, res) => {
    req.logout()
    res.redirect('/auth/academy/login')
})

// Login Form - Students
router.get('/student/login', (req, res, next) => res.render('student/student-login', { errorMsg: req.flash('error') }))

// Login Form Management - Students
router.post('/student/login', passport.authenticate('local', {
    successRedirect: '/student/private-student',
    failureRedirect: '/auth/student/login',
    failureFlash: true,
    passReqToCallback: true
}))

// Logout - Students
router.get('/student/logout', (req, res) => {
    req.logout()
    res.redirect('/auth/student/login')
})

module.exports = router