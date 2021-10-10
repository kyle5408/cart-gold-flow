const express = require('express')
const app = express()

const exhbs = require('express-handlebars')
app.engine('hbs', exhbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const routes = require('./routes')
const port = 3000

app.use(routes)
app.listen(port, () => { console.log(`App is running on http://localhost:${port}`) })