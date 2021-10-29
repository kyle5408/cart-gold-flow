const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const fs = require('fs')
const db = require('../models')
const User = db.User
const Product = db.Product
const Order = db.Order
const pagination = require('../services/pagination')
const pageLimit = 6

const adminController = {
  //登入頁面
  signInPage: (req, res) => {
    return res.render('admin/adminSignIn')
  },

  //登入
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successful！')
    res.redirect('/admin/products')
  },

  //商品頁
  getAdminProducts: async (req, res) => {
    let offset = await pagination.getOffset(req, pageLimit)
    const products = await Product.findAndCountAll({
      offset: offset,
      limit: pageLimit,
      raw: true,
      nest: true
    })
    const { page, totalPage, prev, next } = await pagination.paginate(req, products.count, pageLimit)
    return res.render('admin/adminProducts', {
      products: products.rows,
      page,
      totalPage,
      prev,
      next
    })
  },

  //單一商品
  getAdminProduct: async (req, res) => {
    const product = await Product.findByPk(req.params.id, { raw: true, nest: true })
    return res.render('admin/adminProduct', { product })
  },

  //編輯商品
  putAdminProduct: async (req, res) => {
    const { name, description, price } = req.body
    const product = await Product.findByPk(req.params.id)
    const { file } = req
    if (file) {
      await fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return
        })
      })
    }
    await product.update({
      name,
      description,
      price,
      image: req.file ? `/upload/${file.originalname}` : product.image
    })
  },

  //訂單頁
  getAdminOrders: async (req, res) => {
    let offset = await pagination.getOffset(req, pageLimit)
    const orders = await Order.findAndCountAll({
      offset: offset,
      limit: pageLimit,
      raw: true,
      nest: true
    })
    const { page, totalPage, prev, next } = await pagination.paginate(req, orders.count, pageLimit)
    return res.render('admin/adminOrders', {
      orders: orders.rows,
      page,
      totalPage,
      prev,
      next
    })
  },




}

module.exports = adminController