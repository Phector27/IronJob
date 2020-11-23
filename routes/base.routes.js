const express = require('express')
const router = express.Router()

// INDEX GENERAL DE LA WEB
router.get('/', (req, res) => res.render('index'))


module.exports = router
