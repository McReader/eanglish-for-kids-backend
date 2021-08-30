const express = require("express");
const multer = require("multer");
const cardsRouter = require("./cards");

const passport = require("../passport");

const router = express.Router();
const upload = multer();

router.use(passport.authenticate("basic", { session: false }));

router.get("/", (req, res, next) => {
  const count = +(req.query.count || 10);
  const page = +(req.query.page || 1);

  const categoriesRepo = req.app.locals.categoriesService.repository;

  categoriesRepo
    .getList({ count, page })
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.post("/", upload.none(), (req, res, next) => {
  const categoriesRepo = req.app.locals.categoriesService.repository;

  const creacteCategoryInput = { name: req.body.name, cards: [] };

  categoriesRepo
    .createItem(creacteCategoryInput)
    .then((result) => res.status(201).json(result))
    .catch(next);
});

router.put("/:id", upload.none(), (req, res, next) => {
  const categoryId = req.params.id;
  const name = req.body.name;

  const categoriesRepo = req.app.locals.categoriesService.repository;
  const updateCategoryInput = { name };

  categoriesRepo
    .updateItem(categoryId, updateCategoryInput)
    .then((result) => res.status(200).json(result))
    .catch(next);
});

router.delete("/:id", (req, res, next) => {
  const categoryId = req.params.id;

  const categoriesRepo = req.app.locals.categoriesService.repository;

  categoriesRepo
    .deleteItem(categoryId)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(next);
});

router.use("/:id/cards", cardsRouter);

module.exports = router;
