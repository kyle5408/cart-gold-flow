const db = require('../models')
const User = db.User

const userController = {
  // 登入頁面
  signInPage: (req, res) => {
    return res.render('signIn')
  },

  //登入
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/')
  }



}

module.exports = userController