const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

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
}

module.exports = userController
