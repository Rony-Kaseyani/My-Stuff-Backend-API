/// dependencies
const router = require('express').Router()
const models = require('../models/')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const isLoggedIn = require('./util').isLoggedIn
const routesErrorHandler = require('./util').routesErrorHandler

/// user routes
// dashboard with list of products associated to the logged in user
router.get(
  '/dashboard',
  isLoggedIn,
  routesErrorHandler(async (req, res, next) => {
    const items = await models.Items.findAll({
      where: {
        userId: req.user.id
      }
    })
    return res.status(200).send({ products: items })
  })
)

// post request for login
router.post(
  '/login',
  routesErrorHandler(async (req, res, next) => {
    passport.authenticate('local-signin', async (err, user, info) => {
      if (err || !user) {
        const error = new Error('An Error occured')
        return next(error)
      }

      req.login(user, { session: false }, async error => {
        if (error) return next(error)
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { id: user.id, email: user.email }
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, 'top_secret', {
          expiresIn: '1h'
        })
        //Send back the token to the user
        return res.status(200).cookie('token', token, { httpOnly: true })
      })
    })(req, res, next)
  })
)

router.post('/register', passport.authenticate('local-signup', { session: false }), async (req, res, next) => {
  return res.json({
    message: 'Signup successful',
    user: req.user
  })
})

// logging user out and destroying session
router.get('/logout', isLoggedIn, async (req, res) => {
  req.session.destroy()
  req.logout()
  return res.status(302).redirect('/')
})

module.exports = router
