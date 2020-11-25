const express = require('express')
const router = express.Router()

// Index Website
router.get('/', (req, res) => res.render('index'))

module.exports = router
