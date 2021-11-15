const nodemailer = require('nodemailer')
const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem
const Order = db.Order
const OrderItem = db.OrderItem
const payment = require('../services/payment')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.user,
    pass: process.env.pass
  }
})

const orderController = {
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
      await transporter.sendMail(mailOptions, (error, info) => {
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
  },

  //付款頁面
  getPayment: async (req, res) => {
    const order = await Order.findByPk(req.params.id)
    const tradeInfo = await payment.getTradeInfo(order.amount, '產品名稱', req.user.email)
    await order.update({
      sn: tradeInfo.MerchantOrderNo
    })
    return res.render('payment', { order, tradeInfo })
  },

  //金流回傳
  newebayCallback: async (req, res) => {
    const data = JSON.parse(payment.create_mpg_aes_decrypt(req.body.TradeInfo))
    const order = await Order.findAll({ where: { sn: data['Result'].MerchantOrderNo } })
    await order[0].update({
      payment_status: 1
    })
    return res.redirect('/orders')
  }
}

module.exports = orderController