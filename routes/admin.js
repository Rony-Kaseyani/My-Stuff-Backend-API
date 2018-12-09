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
    return res.status(200).send(JSON.stringify({ products: itemProducts }))
  })
)

// admin items approval/disapproval of post requests
router.post(
  '/items/approve',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    await models.Items.update(
      {
        approved: true
      },
      { where: { id: req.body.product_id } }
    )
    return res.status(302).redirect('/admin/items')
  })
)

router.post(
  '/items/disapprove',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    await models.Items.update(
      {
        approved: false
      },
      { where: { id: req.body.product_id } }
    )
    return res.status(302).redirect('/admin/news')
  })
)

router.post(
  '/items/delete',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    await models.Items.destroy({ where: { id: req.body.product_id } })
    return res.status(302).redirect('/admin/items')
  })
)

// admin user dashboard
router.get(
  '/users',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    const allUsers = await models.user.findAll({})
    return res.status(200).send(JSON.stringify({ users: allUsers }))
  })
)

// admin user make/revoke admin post requests
router.post(
  '/user/make-admin',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    await models.user.update(
      {
        is_admin: true
      },
      { where: { id: req.body.user_id } }
    )
    return res.status(302).redirect('/admin/users')
  })
)

router.post(
  '/user/revoke-admin',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    await models.user.update(
      {
        is_admin: false
      },
      { where: { id: req.body.user_id } }
    )
    return res.status(302).redirect('/admin/users')
  })
)

// admin category dashboard
router.get(
  '/categories',
  isAdmin,
  routesErrorHandler(async (req, res, next) => {
    const categories = await models.Category.findAll({})
    return res.status(200).send(JSON.stringify({ categories: categories }))
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
    return res.status(302).redirect('/admin/categories')
  })
)

module.exports = router
