const router = require("express").Router();
const models = require("../models/");
const multer = require("multer");
const path = require("path");

const dateNow = Date.now() + "-";

const storage = multer.diskStorage({
  destination: "./public/product_images/",
  filename: function(req, file, cb) {
    //req.body is empty...
    //How could I get the new_file_name property sent from client here?
    cb(null, dateNow + file.originalname); //+ '-' + Date.now()+".jpg")
  }
});

var upload = multer({ storage: storage });

router.get("/add", (req, res) => res.render("add-item-form"));

router.post("/add", upload.single("image_file"), (req, res) => {
  const isPublished = 1;

  models.Items.create({
    category: req.body.category,
    product: req.body.product,
    description: req.body.description,
    condition: req.body.condition,
    price: req.body.price,
    city: req.body.city,
    image_path: dateNow + req.file.originalname,
    video: req.body.video_file,
    audio: req.body.audio_file,
    published: isPublished
  }).then(() => {
    console.log(req);
    res.redirect("/");
  });
});

router.get("/product", async (req, res) => {
  models.Items.findAll({
    where: {
      id: 3
    }
  }).then(items => {
    res.render("view-items", { product: items });
  });
});

router.get("/products", async (req, res) => {
  models.Items.findAll({}).then(items => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ products: items }));
  });
});

router.get("/products/:id", async (req, res) => {
  models.Items.findById(req.params.id).then(item => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ product: item }));
  });
});

module.exports = router;
