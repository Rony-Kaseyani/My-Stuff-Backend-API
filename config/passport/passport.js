//load bcrypt
const bCrypt = require('bcrypt-nodejs')
const JWTstrategy = require('passport-jwt').Strategy
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt

module.exports = function(passport, user) {
  const User = user

  const LocalStrategy = require('passport-local').Strategy

  //serialize
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  // deserialize user
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if (user) {
        done(null, user.get())
      } else {
        done(user.errors, null)
      }
    })
  })

  //LOCAL SIGNUP

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',

        passwordField: 'password',

        passReqToCallback: true // allows us to pass back the entire request to the callback
      },

      function(req, email, password, done) {
        var generateHash = function(password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null)
        }

        User.findOne({
          where: {
            email: email
          }
        }).then(function(user) {
          if (user) {
            return done(null, false, {
              message: 'That email is already taken'
            })
          } else {
            const userPassword = generateHash(password)

            const isAdmin = 0

            const data = {
              first_name: req.body.first_name,

              last_name: req.body.last_name,

              email: email,

              password: userPassword,

              is_admin: isAdmin
            }

            User.create(data).then(function(newUser, created) {
              if (!newUser) {
                return done(null, false)
              }

              if (newUser) {
                return done(null, newUser)
              }
            })
          }
        })
      }
    )
  )

  //LOCAL SIGNIN
  passport.use(
    'local-signin',
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email

        usernameField: 'email',

        passwordField: 'password',

        passReqToCallback: true // allows us to pass back the entire request to the callback
      },

      function(req, email, password, done) {
        var User = user

        var isValidPassword = function(userpass, password) {
          return bCrypt.compareSync(password, userpass)
        }

        User.findOne({
          where: {
            email: email
          }
        })
          .then(function(user) {
            if (!user) {
              return done(null, false, {
                message: 'Email does not exist'
              })
            }

            if (!isValidPassword(user.password, password)) {
              return done(null, false, {
                message: 'Incorrect password.'
              })
            }

            var userinfo = user.get()
            return done(null, userinfo)
          })
          .catch(function(err) {
            console.log('Error:', err)

            return done(null, false, {
              message: 'Something went wrong with your Signin'
            })
          })
      }
    )
  )

  //This verifies that the token sent by the user is valid
  passport.use(
    new JWTstrategy(
      {
        //secret we used to sign our JWT
        secretOrKey: 'top_secret',
        //we are extracting the token from the query string parameter secret_token
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
      },
      async (token, done) => {
        try {
          //Pass the user details to the next middleware
          return done(null, token.user)
        } catch (error) {
          done(error)
        }
      }
    )
  )
}
