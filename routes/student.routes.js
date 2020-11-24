/*jshint esversion: 6 */

const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/user.model')
const Offer = require('../models/offer.model')


const bcrypt = require('bcryptjs')
const bcryptSalt = 10


const isLogged = (req, res, next) => req.isAuthenticated() ? next() : res.render('student/student-login', { errorMsg: 'Acceso denegado. Haz login para acceder a esta zona de la web.' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('student/student-login', { errorMsg: 'Acceso denegado. No tienes permisos para ver esta zona de la web. Por favor, contacta con el administrador de la web.' })

// MOSTRAR FORMULARIO DE REGISTRO

router.get('/signup', (req, res, next) => res.render('student/student-signup'))

// GESTIONAR REGISTRO EN BBDD

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
                .catch(() => res.render('student/student-signup', { errorMsg: 'Nombre de empresa ya registrada. Contacta con el responsable de tu empresa.' }))
// revisar error 
        })

        .catch(err => next(err))

})


// MOSTRAR FORMULARIO LOGIN

router.get('/login', (req, res, next) => res.render('student/student-login', { errorMsg: req.flash('error') }))

// GESTIONAR FORMULARIO LOGIN

router.post('/login', passport.authenticate('local', {
    successRedirect: '/student/private-student', //are-privada/perfil
    failureRedirect: '/student/login',
    failureFlash: true,
    passReqToCallback: true
}))


// CERRAR SESION
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/student/login')
})


//ZONA PRIVADA , 'STUDENT'.

// PERFIL-AREA PRIVADA DE ESTUDIANTES - VISUALIZACIÓN DE OFERTAS Y CONTACTO
router.get('/private-student', isLogged, checkRole(['Student']), (req, res, next) => {

    Offer
        .find()
        .then(allOffers => res.render('student/student-profile', { allOffers }))
        .catch(err => next(new Error(err)))

})




module.exports = router