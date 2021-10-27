const routes = require('./routes.js')
const auth = require('./modules/auth.js')
const admin = require('./modules/admin.js')

module.exports = (app) => {
  app.use('/admin', admin)
  app.use('/auth', auth)
  app.use('/', routes)
}
