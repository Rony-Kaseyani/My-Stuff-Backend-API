const app = require('./app')

// starting the server...
const server = app.listen(process.env.PORT || 4000, () => {
  console.log('Listening on port ' + server.address().port)
})

module.exports = server
