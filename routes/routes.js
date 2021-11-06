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
  // res.render('product')
  res.redirect('/products')
})

//使用者登入頁面
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

//使用者註冊頁面
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//使用者首頁(商品頁)
router.get('/products', login.authenticated, userController.getUserIndex)
router.get('/products/:id', login.authenticated, userController.getUserProduct)

//使用者購物車
router.get('/carts', login.authenticated, userController.getUserCart)
router.post('/carts/:id', login.authenticated, userController.postUserCart)
router.put('/carts/', login.authenticated, userController.putUserCart)

//管理者登入頁面
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)

//管理者商品總覽頁面
router.get('/admin/products', login.authenticatedAdmin, adminController.getAdminProducts)

//管理者訂單頁面
router.get('/admin/orders', login.authenticatedAdmin, adminController.getAdminOrders)

//管理者編輯訂單
router.get('/admin/orders/:id', login.authenticatedAdmin, adminController.getAdminOrder)
router.put('/admin/orders/:id', login.authenticatedAdmin, adminController.putAdminOrder)

//管理者商品頁
router.get('/admin/products/:id', login.authenticatedAdmin, adminController.getAdminProduct)

//管理者新增商品
router.get('/admin/products/create', login.authenticatedAdmin, adminController.getAdminProduct)
router.post('/admin/products', login.authenticatedAdmin, upload.single('image'), adminController.postAdminProduct)

//管理者編輯商品
router.put('/admin/products/:id', login.authenticatedAdmin, upload.single('image'), adminController.putAdminProduct)

//管理者刪除商品
router.delete('/admin/products/:id', login.authenticatedAdmin, adminController.deleteProduct)

//登出
router.get('/logout', userController.logout)

module.exports = router