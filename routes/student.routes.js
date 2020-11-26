/*jshint esversion: 6 */

const express = require('express')
const router = express.Router()
const transporter = require('./../configs/nodemailer.config')

const Offer = require('../models/offer.model')

const isLogged = (req, res, next) => req.isAuthenticated() ? next() : res.render('student/student-login', { errorMsg: 'Acceso denegado. Haz login para acceder a esta zona de la web.' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('student/student-login', { errorMsg: 'Acceso denegado. No tienes permisos para ver esta zona de la web. Por favor, contacta con un administrador de IronHack para que modifique tus permisos.' })

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
        .then(selectOffer => res.render('student/student-apply', { selectOffer, user: req.user }))
        .catch(err => next(new Error(err)))
})

router.post('/private-student/apply-offer', (req, res, next) => {

    const { email, subject, message } = req.body

    transporter
        .sendMail({
            from: '"Estudiante interesad@ en oferta de trabajo" <noreply@ironjob.com>',
            to: email,
            subject,
            text: message,
            html: message
        })
        .then(infoSendMail => res.render('student/student-profile', { infoSendMail }))
        .catch(err => next(new Error(err)))
})

module.exports = router