const express = require('express')
const router = express.Router()

router.get('/signin', (req, res) => {
  res.render('admin/adminSignIn')
})


module.exports = router