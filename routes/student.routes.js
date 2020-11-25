/*jshint esversion: 6 */

const express = require('express')
const router = express.Router()
const passport = require('passport')
const transporter = require('./../configs/nodemailer.config')

const User = require('../models/user.model')
const Offer = require('../models/offer.model')

const bcrypt = require('bcryptjs')
const bcryptSalt = 10

const isLogged = (req, res, next) => req.isAuthenticated() ? next() : res.render('student/student-login', { errorMsg: 'Acceso denegado. Haz login para acceder a esta zona de la web.' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('student/student-login', { errorMsg: 'Acceso denegado. No tienes permisos para ver esta zona de la web. Por favor, contacta con un administrador de IronHack para que modifique tus permisos.' })

// Sign up form
router.get('/signup', (req, res, next) => res.render('student/student-signup'))

// Sign up form management
router.post('/signup', (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render('student/student-signup', { errorMsg: 'Por favor, rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {
            if (theUser) {
                res.render('student/student-signup', { errorMsg: 'Nombre de usuario ya registrado.' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.redirect('/student/login'))
                .catch(() => res.render('student/student-signup', { errorMsg: 'Error. Contacta con un administrador de IronHack.' }))
        })
        .catch(err => next(err))
})


// Login Form
router.get('/login', (req, res, next) => res.render('student/student-login', { errorMsg: req.flash('error') }))

// Login Form Management
router.post('/login', passport.authenticate('local', {
    successRedirect: '/student/private-student',
    failureRedirect: '/student/login',
    failureFlash: true,
    passReqToCallback: true
}))

// Logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/student/login')
})

//Private Zone , 'STUDENT'.

// Profile -Private Area for Students
router.get('/private-student', isLogged, checkRole(['Student']), (req, res, next) => {

    Offer
        .find()
        .then(allOffers => res.render('student/student-profile', { allOffers }))
        .catch(err => next(new Error(err)))
})

router.get('/private-student/apply-offer', isLogged, checkRole(['Student']), (req, res, next) => { 

    Offer
        .findById(req.query.id)
        .then(selectOffer => res.render('student/student-apply', { selectOffer }))
        .catch(err => next(new Error(err)))
})

router.post('/private-student/apply-offer', (req, res, next) => {

    const { email, subject, message } = req.body

    transporter
        .sendMail({
            from: '"IronJob Estudiante Interesado " <noreply@ironjob.com>',
            to: email,
            subject,
            text: message,
            html: message
        })
        .then(infoSendMail => res.render('student/student-profile', { infoSendMail }))
        .catch(err => next(new Error(err)))
})

module.exports = router