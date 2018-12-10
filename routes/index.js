// dependencies
const router = require('express').Router()
const routesErrorHandler = require('./util').routesErrorHandler

/// models and database
// requiring models
const models = require('../models')
// syncing database and checking connection to it
async function checkDbConnection() {
  try {
    await models.sequelize.sync()
    return console.log('Database connection correct')
  } catch (err) {
    return console.log(err, 'Something went wrong with connecting to the database')
  }
}
checkDbConnection()

// getting search results after querying database with q parameter from querystring
router.get(
  '/search',
  routesErrorHandler(async (req, res, next) => {
    const searchResults = await models.Items.findAll({
      where: models.sequelize.where(
        models.sequelize.fn('concat', models.sequelize.col('description'), models.sequelize.col('title')),
        {
          $like: `%${req.query.q}%`
        }
      ),
      order: [['createdAt', 'DESC']],
      where: { published: true }
    })
    return res.status(200).send({ title: 'Search', list: searchResults })
  })
)

// post request action for form in layout sidebar
router.post('/search', async (req, res) => res.status(302).redirect(`/search?q=${req.body.query}`))

/// delegating model specific routes to separate files for better organisation
// admin routes
router.use('/admin', require('./admin'))
// user routes
router.use('/users', require('./users'))
// news routes
router.use('/items', require('./items'))

module.exports = router
