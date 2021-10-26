const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

  //本地登入策略
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } })
      .then(user => {
        if (!user) { 
          return cb(null, false, req.flash('error_messages', '帳號不存在！'))}
        if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '密碼輸入錯誤!'))
        return cb(null, user)
      })
      .catch(err => cb(err, false))
  }
))

//序列化及反序列化
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async(id, cb) => {
  try {
    const user = await User.findByPk(id)
    const userToJSON = await user.toJSON()
    return cb(null, userToJSON)
  } catch (error) {
    res.render('signIn', { Error })
  }
})

module.exports = passport