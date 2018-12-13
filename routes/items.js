/// dependencies
const router = require('express').Router()
const isLoggedIn = require('./util').isLoggedIn
const models = require('../models/')
const routesErrorHandler = require('./util').routesErrorHandler

router.get(
  '/',
  routesErrorHandler(async (req, res, next) => {
    const allItems = await models.Items.findAll({})
    return res.send({ products: allItems })
  })
)

/// item routes namespaced with /items
// post request for adding new new item prodcut
router.post(
  '/add-item',
  isLoggedIn,
  routesErrorHandler(async (req, res, next) => {
    const isPublished = true
    const isReported = false
    const sessionID = req.user.id
    await models.Items.create({
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      condition: req.body.condition,
      price: req.body.price,
      city: req.body.city,
      published: isPublished,
      reported: isReported,
      userId: sessionID
    })

    return res.status(200)
  })
)

// get single item product
router.get(
  '/product/:id',
  routesErrorHandler(async (req, res, next) => {
    const productId = req.params.id
    if (Math.round(productId)) {
      const itemProductRatings = await models.Ratings.findAll({
        where: {
          itemId: productId
        }
      })
      let arrOfRatings = []
      itemProductRatings.forEach(rating => {
        arrOfRatings.push(rating.dataValues.rating)
      })
      const ratingsCount = arrOfRatings.length
      const ratingsAvg = (arrOfRatings.reduce((p, c) => p + c, 0) / arrOfRatings.length).toFixed(1) || 0
      const itemProduct = await models.Items.findById(productId)
      const user = await models.Users.findById(itemProduct.UserId)
      const description = itemProduct.description
      const title = itemProduct.title
      const price = itemProduct.price
      const condition = itemProduct.condition
      const city = itemProduct.city
      const seller = `${user.first_name} ${user.last_name}`
      const publishedDate = itemProduct.createdAt.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      return res.status(200).send({
        title,
        price,
        condition,
        description,
        seller,
        city,
        publishedDate,
        ratingsAvg,
        ratingsCount
      })
    } else {
      let err = new Error('The product you were looking for could not be found.')
      err.status = 404
      next(err)
    }
  })
)

// submit rating for item product
router.post(
  '/product/:id/submit-rating',
  isLoggedIn,
  routesErrorHandler(async (req, res, next) => {
    await models.Ratings.create({
      rating: req.body.rating,
      userId: req.user.id,
      ItemId: req.params.id
    })
    res.status(200)
  })
)

// edit item product
router.get(
  '/product/:id/edit',
  isLoggedIn,
  routesErrorHandler(async (req, res, next) => {
    const product = await models.Items.findById(req.params.id)
    return res.status(200).send({ product })
  })
)

// post request for editing item product
router.post(
  '/product/:id/edit',
  isLoggedIn,
  routesErrorHandler(async (req, res, next) => {
    const product = await models.Items.findById(req.params.id)
    await models.Items.update(
      {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        condition: req.body.condition,
        price: req.body.price,
        city: req.body.city
      },
      { where: { id: req.params.id, userId: req.user.id } }
    )
    return res.status(200)
  })
)

router.post(
  '/product/:id/delete',
  isLoggedIn,
  routesErrorHandler(async (req, res, next) => {
    await models.Items.destroy({ where: { id: req.params.id, userId: req.user.id } })
    return res.status(200)
  })
)

// listing item products based on category in the url
router.get(
  '/:category',
  routesErrorHandler(async (req, res, next) => {
    const categoryInDb = await models.Categories.findAll({ where: { title: req.params.category } })
    if (categoryInDb.length) {
      const item = await models.Items.findAll({
        where: {
          category: req.params.category,
          published: true
        },
        order: [['createdAt', 'DESC']]
      })
      res.locals.category_nav_title = req.params.category
      return res.status(200).send({ title: req.params.category, list: item })
    } else {
      let err = new Error('The category you requested does not exist.')
      err.status = 404
      next(err)
    }
  })
)

module.exports = router
