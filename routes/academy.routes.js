/*jshint esversion: 6 */

const express = require('express')
const router = express.Router()

const User = require('../models/user.model')
const Offer = require('../models/offer.model')

const isLogged = (req, res, next) => req.isAuthenticated() ? next() : res.render('academy/academy-login', { errorMsg: 'Acceso denegado. Haz login para acceder a esta zona de la web.' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('academy/academy-login', { errorMsg: 'Acceso denegado. No tienes permisos para ver esta zona de la web. Por favor, contacta con un administrador de IronHack para que modifique tus permisos.' })

// Private Area , 'IRONHACK-RECRUITER'.
// Profile-Private Area for IRONHACK
router.get('/private-academy', isLogged, checkRole(['IRONHACK-RECRUITER']), (req, res, next) => {

    Offer
        .find()
        .then(allOffers => res.render('academy/academy-profile', { allOffers }))
        .catch(err => next(new Error(err)))
})

// Control Panel
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

// Delete Offer Job
router.get('/private-academy/delete', isLogged, checkRole(['IRONHACK-RECRUITER']), (req, res, next) => {

    Offer
        .findByIdAndRemove(req.query.id)
        .then(() => res.redirect('/academy/private-academy'))
        .catch(err => next(new Error(err)))
})

module.exports = router
