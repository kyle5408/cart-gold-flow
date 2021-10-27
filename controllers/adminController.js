const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const adminController = {
  //登入頁面
  signInPage: (req, res) => {
    return res.render('admin/adminSignIn')
  },

  //登入
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successful！')
    res.redirect('/admin')
  },

  //首頁
  getAdminIndex: (req, res) => {
    return res.render('admin/adminIndex')
  }

}

module.exports = adminController