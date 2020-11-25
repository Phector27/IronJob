const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPWD
    }
})


module.exports = transporter