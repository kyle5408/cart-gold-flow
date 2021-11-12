const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const db = require('../models')
const User = db.User
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem
const Order = db.Order
const OrderItem = db.OrderItem
const pagination = require('../services/pagination')
const pageLimit = 15

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.user,
    pass: process.env.pass
  }
})

const userController = {
  // 登入頁面
  signInPage: (req, res) => {
    return res.render('signIn')
  },

  //登入
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successful！')
    res.redirect('/')
  },

  //登出
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },

  //註冊頁面
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  //註冊
  signUp: async (req, res) => {
    try {
      const { email, name, password, checkPassword } = req.body
      if (!name || name.length > 50 || !email || checkPassword !== password) {
        req.flash('error_messages', 'Please check required field！')
        return res.render('signup', { email, name, password, checkPassword })
      }
      const users = await User.findAll({ raw: true, nest: true, where: { email } })
      if (users.some(item => item.email === email)) {
        req.flash('error_messages', 'Account already be registered！')
        return res.render('signup', { email, name, password, checkPassword })
      }
      await User.create({
        email,
        name,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      req.flash('success_messages', 'Your account had been successfully registered!')
      return res.redirect('/signin')
    }
    catch (error) {
      res.render('signIn', { Error })
    }
  },

  //首頁(商品總覽)
  getUserIndex: async (req, res) => {
    let offset = await pagination.getOffset(req, pageLimit)
    const products = await Product.findAndCountAll({
      offset: offset,
      limit: pageLimit,
      raw: true,
      nest: true
    })
    const { page, totalPage, prev, next } = await pagination.paginate(req, products.count, pageLimit)
    return res.render('index', {
      products: products.rows,
      page,
      totalPage,
      prev,
      next
    })
  },

  //單一商品
  getUserProduct: async (req, res) => {
    const product = await Product.findByPk(req.params.id, { raw: true, nest: true })
    return res.render('product', { product })
  },

  //新增至購物車
  postUserCart: async (req, res) => {
    const addVol = Number(req.body.vol)
    const cart = await Cart.findOrCreate({ where: { UserId: req.user.id }, raw: true, nest: true })
    const cartUser = cart[0].id
    const cartItem = await CartItem.findOne({ where: { CartId: cartUser, ProductId: req.params.id } })
    if (cartItem) {
      quantity = addVol ? cartItem.quantity + addVol : cartItem.quantity + 1
      await cartItem.update({
        quantity
      })
    } else {
      await CartItem.create({
        CartId: cartUser,
        ProductId: req.params.id,
        quantity: 1
      })
    }
    req.flash('success_messages', 'Successfully add to cart!')
    if (addVol) return res.redirect(`/products/${req.params.id}`)
    return res.redirect('/products')
  },

  //購物車清單
  getUserCart: async (req, res) => {
    const cart = await Cart.findOne({ where: { UserId: req.user.id }, raw: true, nest: true })
    const cartUser = cart.id
    const cartItems = await CartItem.findAll({ include: [Product], where: { CartId: cartUser } })
    const cartItem = await cartItems.map(d => ({
      ...d.dataValues,
      image: d.dataValues.Product.image,
      name: d.dataValues.Product.name,
      price: d.dataValues.Product.price
    }))
    return res.render('carts', { cartItem })
  },

  //修改購物車數量
  putUserCart: async (req, res) => {
    const cart = await Cart.findOne({ where: { UserId: req.user.id }, raw: true, nest: true })
    const cartUser = cart.id
    const cartItems = await CartItem.findAll({ where: { CartId: cartUser } })
    const vol = req.body.vol
    for (let i = 0; i < cartItems.length; i++) {
      if (vol[i] === '0') {
        await cartItems[i].destroy()
      } else {
        await cartItems[i].update({
          quantity: vol[i]
        })
      }
    }
    req.flash('success_messages', 'Update successful！')
    return res.redirect('/carts')
  },

  //刪除購物車
  deleteUserCart: async (req, res) => {
    const cart = await Cart.findOne({ where: { UserId: req.user.id }, raw: true, nest: true })
    const cartUser = cart.id
    await CartItem.destroy({ where: { ProductId: req.params.id, CartId: cartUser } })
    req.flash('success_messages', 'Delete successful！')
    return res.redirect('/carts')
  },

  //訂單頁面
  getUserOrder: async (req, res) => {
    const order = await Order.findAll({ where: { UserId: req.user.id }, include: [{ model: OrderItem, include: [Product] }] })
    const orderItems = await order.map(item => ({
      ...item.dataValues,
    }))
    for (let i = 0; i < orderItems.length; i++) {
      orderItems[i].items = await orderItems[i].OrderItems.map(item => ({
        ...item.dataValues,
        name: item.dataValues.Product.dataValues.name,
        image: item.dataValues.Product.dataValues.image,
        price: item.dataValues.Product.dataValues.price,
      }))
    }
    return res.render('orders', { orderItems })
  },

  //刪除訂單
  deleteUserOrder: async (req, res) => {
    await Order.destroy({ where: { id: req.params.id } })
    return res.redirect('/orders')
  },

  //建立訂單頁面
  getUserCreateOrder: async (req, res) => {
    const cart = await Cart.findOne({ where: { UserId: req.user.id }, raw: true, nest: true })
    const cartUser = cart.id
    const cartItems = await CartItem.findAll({ where: { CartId: cartUser }, include: [Product] })
    const cartItem = await cartItems.map(item => ({
      ...item.dataValues,
      name: item.Product.dataValues.name,
      image: item.Product.dataValues.image,
      price: item.Product.dataValues.price
    }))
    return res.render('createOrder', { cartItem })
  },

  //建立訂單
  postUserOrder: async (req, res) => {
    if (!req.body.name || !req.body.phone || !req.body.address) {
      req.flash('error_messages', 'Please check required field！')
    } else {
      const { name, phone, address, amount } = req.body
      const order = await Order.create({
        name,
        phone,
        address,
        amount,
        shipping_status: 0,
        payment_status: 0,
        UserId: req.user.id,
      })
      const { ProductId, vol } = req.body
      for (let i = 0; i < ProductId.length; i++) {
        await OrderItem.create({
          OrderId: order.id,
          ProductId: ProductId[i],
          quantity: vol[i]
        })
      }
      const mailOptions = {
        from: process.env.user,
        to: req.user.email,
        subject: '123 Shopping Mall訂單成立通知信',
        text: `#${order.id}訂單成立，感謝您的訂購。`,
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
        } else {
          console.log('Email sent:', info.response)
        }
      })
      return res.redirect('/orders')
    }
  },

  //刪除訂單商品
  deleteOrderItem: async (req, res) => {
    const cart = await Cart.findOne({ where: { UserId: req.user.id }, raw: true, nest: true })
    const cartUser = cart.id
    await CartItem.destroy({ where: { ProductId: req.params.id, CartId: cartUser } })
    req.flash('success_messages', 'Delete successful！')
    return res.redirect('/orders/create')
  }

}

module.exports = userController
