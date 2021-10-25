const express = require('express')
const router = express.Router()
const users = require('./models/users.js')

router.get('/', (req, res) => {
  res.render('signIn')
})

router.use('/users', users)

module.exports = router
