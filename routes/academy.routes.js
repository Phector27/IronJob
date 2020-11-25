/*jshint esversion: 6 */

const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/user.model')
const Offer = require('../models/offer.model')


const bcrypt = require('bcryptjs')
const bcryptSalt = 10


const isLogged = (req, res, next) => req.isAuthenticated() ? next() : res.render('academy/academy-login', { errorMsg: 'Acceso denegado. Haz login para acceder a esta zona de la web.' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('academy/academy-login', { errorMsg: 'Acceso denegado. No tienes permisos para ver esta zona de la web. Por favor, contacta con un administrador de IronHack para que modifique tus permisos.' })


// MOSTRAR FORMULARIO DE REGISTRO

router.get('/signup', (req, res, next) => res.render('academy/academy-signup'))

// GESTIONAR REGISTRO EN BBDD

router.post('/signup', (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render('academy/academy-signup', { errorMsg: 'Por favor, rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {
            if (theUser) {
                res.render('academy/academy-signup', { errorMsg: 'Nombre de usuario ya registrado.' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.redirect('/academy/login'))
                .catch(() => res.render('academy/academy-signup', { errorMsg: 'Error. Contacta con el administrador de la web.' }))

        })

        .catch(err => next(err))

})


// MOSTRAR FORMULARIO LOGIN

router.get('/login', (req, res, next) => res.render('academy/academy-login', { errorMsg: req.flash('error') }))

// GESTIONAR FORMULARIO LOGIN

router.post('/login', passport.authenticate('local', {
    successRedirect: '/academy/private-academy', //are-privada/perfil
    failureRedirect: '/academy/login',
    failureFlash: true,
    passReqToCallback: true
}))


// CERRAR SESION
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/academy/login')
})


//ZONA PRIVADA , 'IRONHACK-RECRUITER'.

// PERFIL-AREA PRIVADA DE IRONHACK - VISUALIZACIÓN Y ELIMINACIÓN DE OFERTAS
router.get('/private-academy', isLogged, checkRole(['IRONHACK-RECRUITER']), (req, res, next) => {

    Offer
        .find()
        .then(allOffers => res.render('academy/academy-profile', { allOffers }))
        .catch(err => next(new Error(err)))

})


// Panel control

router.get('/panel-control', isLogged, checkRole(['IRONHACK-RECRUITER']), (req, res, next) => {

    User
        .find()
        .then(allUsers => res.render('academy/academy-panel-control', { allUsers }))
        .catch(err => next(new Error(err)))

})


// Edit user roles
router.get('/panel-control/edit', isLogged, checkRole(['IRONHACK-RECRUITER']), (req, res, next) => {


    User
        .findById(req.query.id)
        .then(editUserRole => res.render('academy/academy-edit', { editUserRole }))
        .catch(err => next(new Error(err)))

})


router.post('/panel-control/edit', isLogged, checkRole(['IRONHACK-RECRUITER']), (req, res, next) => {

    const { role } = req.body

    User
        .findByIdAndUpdate(req.query.id, { role })
        .then(() => res.redirect('/academy/panel-control'))
        .catch(err => next(new Error(err)))

})



// Delete user

router.get('/panel-control/delete', isLogged, checkRole(['IRONHACK-RECRUITER']), (req, res, next) => {

    User
        .findByIdAndRemove(req.query.id)
        .then(() => res.redirect('/academy/panel-control'))
        .catch(err => next(new Error(err)))
})



// ELIMINAR UNA OFERTA DE EMPLEO
router.get('/private-academy/delete', isLogged, checkRole(['IRONHACK-RECRUITER']), (req, res, next) => {

    Offer
        .findByIdAndRemove(req.query.id)
        .then(() => res.redirect('/academy/private-academy'))
        .catch(err => next(new Error(err)))
})

module.exports = router
