const passport = require('passport')

module.exports.isLoggedIn = function(req, res, next) {
  passport.authenticate('jwt', { session: false })(req, res, next)
}

module.exports.isAdmin = function(req, res, next) {
  if (req.user && (passport.authenticate('jwt', { session: false }) && req.user.is_admin === true)) return next()
  let err = new Error('Unauthorized access')
  err.status = 403
  next(err)
}

module.exports.routesErrorHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
