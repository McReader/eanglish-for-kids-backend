const express = require("express");
const multer = require("multer");
const { ObjectId } = require("mongodb");

const passport = require("../passport");

const FILE_SIZE_LIMIT = 100 * 1024; // 100kb

const router = express.Router();
const upload = multer({
  limits: { fileSize: FILE_SIZE_LIMIT },
  storage: multer.memoryStorage(),
});

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
    .updateItem(categoryId, updateDocument)
    .then((result) => res.status(200).json(result))
    .catch(next);
});

router.delete("/:id", (req, res, next) => {
  const categoryId = req.params.id;

  const categoriesRepo = req.app.locals.categoriesService.repository;

  categories
    .deleteItem(categoryId)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(next);
});

router.get("/:id/cards", (req, res, next) => {
  const categoryId = req.params.id;
  const count = +(req.query.count || 10);
  const page = +(req.query.page || 1);

  const cardsRepo = req.app.locals.cardsService.repository;

  cardsRepo
    .getList(categoryId, { count, page })
    .then((result) => {
      res.json(result.cards);
    })
    .catch(next);
});

router.post(
  "/:id/cards",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "sound", maxCount: 1 },
  ]),
  (req, res, next) => {
    const categoryId = req.params.id;
    const { image, sound, translation, word } = req.body;
    const image = req.files.image?.[0];
    const sound = req.files.sound?.[0];

    const cardsService = req.app.locals.cardsService;

    const createCardInput = {
      image,
      sound,
      translation,
      word,
    };

    cardsService
      .createItem(categoryId, createCardInput)
      .then((result) => {
        res.status(201).json(result);
      })
      .catch(next);
  }
);

router.put(
  "/:id/cards/:cardId",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "sound", maxCount: 1 },
  ]),
  (req, res, next) => {
    const categoryId = req.params.id;
    const cardId = req.params.cardId;
    const { translation, word } = req.body;
    const image = req.files.image?.[0];
    const sound = req.files.sound?.[0];

    const cardsService = req.app.locals.cardsService;

    const updateCardInput = {
      image,
      sound,
      translation,
      word,
    };

    cardsService
      .updateItem(categoryId, cardId, updateCardInput)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(next);
  }
);

router.delete("/:id/cards/:cardId", (req, res, next) => {
  const categoryId = req.params.id;
  const cardId = req.params.cardId;

  const cardsRepo = req.app.locals.cardsService.repository;

  cardsRepo
    .deleteItem(categoryId, cardId)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(next);
});

module.exports = router;
