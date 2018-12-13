/// dependencies
const router = require('express').Router()
const models = require('../models/')
const isAdmin = require('./util').isAdmin
const routesErrorHandler = require('./util').routesErrorHandler

/// admin routes namespaced with /admin
// admin items dashboard
router.get(
  '/items',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    const newsArticles = await models.Items.findAll({ order: [['createdAt', 'DESC']] })
    return res.status(200).send({ products: itemProducts })
  })
)

router.post(
  '/items/delete',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    await models.Items.destroy({ where: { id: req.body.product_id } })
    return res.status(200)
  })
)

// admin user dashboard
router.get(
  '/users',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    const allUsers = await models.Users.findAll({})
    return res.status(200).send({ users: allUsers })
  })
)

// admin user make/revoke admin post requests
router.post(
  '/user/make-admin',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    await models.Users.update(
      {
        is_admin: true
      },
      { where: { id: req.body.user_id } }
    )
    return res.status(200)
  })
)

router.post(
  '/user/revoke-admin',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    await models.Users.update(
      {
        is_admin: false
      },
      { where: { id: req.body.user_id } }
    )
    return res.status(200)
  })
)

// admin category dashboard
router.get(
  '/categories',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    const categories = await models.Category.findAll({})
    return res.status(200).send({ categories: categories })
  })
)

// admin category add form
router.get('/category/add-new', isAdmin, async (req, res) => res.status(200))

// admin category add post request
router.post(
  '/category/add-new',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    await models.Category.create({
      title: req.body.title,
      description: req.body.description
    })
    return res.status(200)
  })
)

module.exports = router
