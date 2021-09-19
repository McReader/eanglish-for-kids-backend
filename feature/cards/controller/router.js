const express = require("express");
const multer = require("multer");

const FILE_SIZE_LIMIT = 100 * 1024; // 100kb

const router = express.Router();
const upload = multer({
  limits: { fileSize: FILE_SIZE_LIMIT },
  storage: multer.memoryStorage(),
});

router.get("/", (req, res, next) => {
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
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "sound", maxCount: 1 },
  ]),
  (req, res, next) => {
    const categoryId = req.params.id;
    const { translation, word } = req.body;
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
  "/:cardId",
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

router.delete("/:cardId", (req, res, next) => {
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
