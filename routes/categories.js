const express = require('express');
const multer  = require('multer');
const { ObjectId } = require('mongodb');

const router = express.Router();
const upload = multer({ dest: 'public/uploads' });

router.get('/', (req, res, next) => {
  const db = req.app.locals.db;
  const categories = db.collection('categories');
  categories
    .find({})
    .then((result) => {
      res.json(result.toArray());
    })
    .catch(next);
});

router.post('/', upload.none(), (req, res, next) => {
  const category = { name: req.body.name, cards: [] };
  const db = req.app.locals.db;
  const categories = db.collection('categories');
  categories
    .insertOne(category)
    .then(result => res.json(result))
    .catch(next);
});

router.get('/:id/cards', (req, res, next) => {
  const categoryId = req.params.id;
  const db = req.app.locals.db;
  const categories = db.collection('categories');
  const filter = { _id: new ObjectId(categoryId) };
  categories
    .findOne(filter)
    .then((result) => {
      if (!result) {
        throw new Error(`Category with ID(${categoryId}) not found`);
      }
      res.json(result.cards);
    })
    .catch(next);
});

router.post('/:id/cards', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'sound', maxCount: 1 }]), (req, res, next) => {
  const categoryId = req.params.id;
  const image = req.files['image']?.[0];
  const sound = req.files['sound']?.[0];
  const db = req.app.locals.db;

  const card = {
    translation: req.body.translation,
    word: req.body.word,
    image: image ? { path: `/uploads/${image?.filename}` } : undefined,
    sound: sound ? { path: `/uploads/${sound?.filename}` } : undefined,
  };

  const filter = { _id: new ObjectId(categoryId) };
  const update = {
    $push: {
      cards: card,
    },
  };
  const categories = db.collection('categories');
  categories
    .updateOne(filter, update)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

module.exports = router;
