const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
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