const router = require('express').Router()
const models = require('../models/')

router.get('/add', (req, res) => res.render('add-item-form'))

router.post('/add', (req, res) => {

    const isPublished = 0

    models.Items.create({
        category: req.body.category,
        product: req.body.product,
        description: req.body.description,
        condition: req.body.condition,
        price: req.body.price,
        city: req.body.city,
        image: req.body.image_file,
        video: req.body.video_file,
        audio: req.body.audio_file,
        published: isPublished
    }).then(() => {
        res.redirect('/')
    })
})

router.get('/product', async(req, res) => {

    models.Items.findAll({
        where: {
            id: 3
          }
    }).then((items) => {
        res.render('view-items', {product: items})
    })
}) 

router.get('/products', async(req, res) => {

    models.Items.findAll({
    }).then((items) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify({products: items}))
    })
}) 

module.exports = router