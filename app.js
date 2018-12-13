// Dependencies
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const models = require('./models')
const isLoggedIn = require('./routes/util').isLoggedIn

// init express app
const app = express()

const isProduction = process.env.NODE_ENV === 'production'

/// express config
app.use(compression())
app.set('json spaces', 2)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(passport.initialize())

app.get('/checkToken', isLoggedIn, function(req, res) {
  res.sendStatus(200)
})

app.use(require('./routes'))

//load passport strategies
require('./config/passport/passport.js')(passport, models.Users)

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('The requested resource is not available.')
  err.status = 404
  next(err)
})

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    console.error(err)
    console.log(err.stack)

    res.status(err.status || 500)

    res.send({
      errors: {
        message: err.message,
        error: err
      }
    })
  })
}

// production error handler
// no stacktraces leaked to the client
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    errors: {
      message: err.message,
      error: {}
    }
  })
})

module.exports = app
