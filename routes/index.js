const routes = require('./routes.js')
const auth = require('./modules/auth.js')

module.exports = (app) => {
  app.use('/auth', auth)
  app.use('/', routes)
}
