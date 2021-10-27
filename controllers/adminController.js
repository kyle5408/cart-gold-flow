const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Product = db.Product
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

  //首頁(Products)
  getAdminIndex: async (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    const products = await Product.findAndCountAll({
      offset: offset,
      limit: pageLimit,
      raw: true,
      nest: true
    })
    const page = Number(req.query.page) || 1
    const pages = Math.ceil(products.count / pageLimit)
    const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
    const prev = page - 1 < 1 ? 1 : page - 1
    const next = page + 1 > pages ? pages : page + 1
    return res.render('admin/adminProducts', {
      products: products.rows,
      page,
      totalPage,
      prev,
      next
    })
  }

}

module.exports = adminController