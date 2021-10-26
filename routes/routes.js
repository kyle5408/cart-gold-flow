const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')

router.get('/', (req, res) => {
  res.render('signUp')
})

//使用者登入頁面
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

//使用者註冊頁面
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

module.exports = router