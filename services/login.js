const login = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role !== 'admin' || !req.user.role) {
        return next()
      }
      if (req.user.role === 'admin') {
        req.flash('error_messages', 'Please use user login!')
        return res.redirect('/signin')
      }
    }
    req.flash('error_messages', 'Please login first!')
    res.redirect('/signin')
  },

  authenticatedAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role === "admin") {
        return next()
      } else {
        req.flash('error_messages', 'Please check your role!')
        return res.redirect('/admin/signin')
      }
    }
    req.flash('error_messages', 'Please login first!')
    res.redirect('/admin/signin')
  }
}

module.exports = login