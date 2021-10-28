const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const login = require('../services/login')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const user = require('../models/user')

router.get('/', (req, res) => {
  res.render('admin/adminIndex')
})

//使用者登入頁面
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

//使用者註冊頁面
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// //使用者首頁
// router.get('/', login.authenticated, userController.getUserIndex)

//管理者登入頁面
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)

//管理者商品總覽頁面
router.get('/admin/products', login.authenticatedAdmin, adminController.getAdminProducts)

//管理者訂單頁面
router.get('/admin/orders', login.authenticatedAdmin, adminController.getAdminOrders)

//管理者商品頁
router.get('/admin/products/:id', login.authenticatedAdmin, adminController.getAdminProduct)
// router.put('/admin/products/:id', login.authenticatedAdmin, upload.single('image'),adminController.putAdminProduct)

module.exports = router