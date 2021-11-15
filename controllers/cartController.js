const bcrypt = require('bcryptjs')
const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem

const cartController = {
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
  }
}

module.exports = cartController