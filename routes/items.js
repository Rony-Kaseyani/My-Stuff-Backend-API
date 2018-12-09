/// dependencies
const router = require('express').Router()
const isLoggedIn = require('./util').isLoggedIn
const models = require('../models/')
const multer = require('multer')
const showdown = require('showdown')
const routesErrorHandler = require('./util').routesErrorHandler

// init markdown to html converter
const converter = new showdown.Converter()

// current date
const dateNow = Date.now() + '-'

//image upload directory
const storage = multer.diskStorage({
  destination: './public/product_images/',
  filename: function(req, file, cb) {
    //Get the new_file_name property sent from client
    cb(null, dateNow + file.originalname)
  }
})

let imageUpload = multer({ storage: storage })

/// item routes namespaced with /item
// get form to add new item prodcut
router.get('/add-item', isLoggedIn, async (req, res) => res.status(200))

// post request for adding new new item prodcut
router.post(
  '/add-item',
  isLoggedIn,
  imageUpload.single('image_file'),
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
      image: dateNow + req.file.originalname,
      published: isPublished,
      reported: isReported,
      userId: sessionID
    })

    return res.status(302).redirect('/')
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
          ItemId: productId
        }
      })
      let arrOfRatings = []
      itemProductRatings.forEach(rating => {
        arrOfRatings.push(rating.dataValues.rating)
      })
      const itemProductRatingsCount = arrOfRatings.length
      const itemProductRatingsAvg = (arrOfRatings.reduce((p, c) => p + c, 0) / arrOfRatings.length).toFixed(1) || 0
      const itemProduct = await models.Items.findById(productId)
      const user = await models.user.findById(itemProduct.userId)
      const description = converter.makeHtml(itemProduct.description)
      const seller = `${user.first_name} ${user.last_name}`
      const publishedDate = itemProduct.createdAt.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      return res.status(200).send(
        JSON.stringify({
          itemProduct,
          description,
          seller,
          publishedDate,
          itemProductRatingsAvg,
          itemProductRatingsCount
        })
      )
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
    res.status(302).redirect(`/items/product/${req.params.id}`)
  })
)

// edit item product
router.get(
  '/product/:id/edit',
  isLoggedIn,
  routesErrorHandler(async (req, res, next) => {
    const product = await models.Items.findById(req.params.id)
    return res.status(200).send(JSON.stringify({ product }))
  })
)

// post request for editing item product
router.post(
  '/product/:id/edit',
  isLoggedIn,
  imageUpload.single('imagefile'),
  routesErrorHandler(async (req, res, next) => {
    const product = await models.Items.findById(req.params.id)
    await models.Items.update(
      {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        condition: req.body.condition,
        price: req.body.price,
        city: req.body.city,
        image: req.file ? dateNow + req.file.originalname : product.image
      },
      { where: { id: req.params.id, userId: req.user.id } }
    )
    return res.status(302).redirect('/users/dashboard')
  })
)

router.post(
  '/product/:id/delete',
  isLoggedIn,
  routesErrorHandler(async (req, res, next) => {
    await models.Items.destroy({ where: { id: req.params.id, userId: req.user.id } })
    return res.status(302).redirect('/users/dashboard')
  })
)

// listing item products based on category in the url
router.get(
  '/:category',
  routesErrorHandler(async (req, res, next) => {
    const categoryInDb = await models.Category.findAll({ where: { title: req.params.category } })
    if (categoryInDb.length) {
      const item = await models.Items.findAll({
        where: {
          category: req.params.category,
          published: true
        },
        order: [['createdAt', 'DESC']]
      })
      res.locals.category_nav_title = req.params.category
      return res.status(200).send(JSON.stringify({ title: req.params.category, list: item }))
    } else {
      let err = new Error('The category you requested does not exist.')
      err.status = 404
      next(err)
    }
  })
)

module.exports = router
