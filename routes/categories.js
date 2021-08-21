const express = require('express');
const multer  = require('multer');
const { ObjectId } = require('mongodb');

const passport = require('../passport');

const FILE_SIZE_LIMIT = 100 * 1024; // 100kb

const router = express.Router();
const upload = multer({ limits: { fileSize: FILE_SIZE_LIMIT }, storage: multer.memoryStorage() })

router.use(passport.authenticate('basic', { session: false }));

router.get('/', (req, res, next) => {
  const count = +(req.query.count || 10);
  const page = +(req.query.page || 1);

  const db = req.app.locals.db;
  const categories = db.collection('categories');

  const pipeline = [
    {
      $project: {
        name: 1,
        cardsCount: { $cond: { if: { $isArray: "$cards" }, then: { $size: "$cards" }, else: "NA"} }
      }
    }
  ];

  categories
    .aggregate(pipeline)
    .skip(count * (page - 1))
    .limit(count)
    .toArray()
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.post('/', upload.none(), (req, res, next) => {
  const category = { name: req.body.name, cards: [] };
  const db = req.app.locals.db;
  const categories = db.collection('categories');
  categories
    .insertOne(category)
    .then(result => res.status(201).json(result))
    .catch(next);
});

router.put('/:id', upload.none(), (req, res, next) => {
  const categoryId = req.params.id;
  const name = req.body.name;
  const db = req.app.locals.db;
  const categories = db.collection('categories');

  const filter = { _id: new ObjectId(categoryId) };
  const updateDocument = { $set: { name } };

  categories
    .updateOne(filter, updateDocument)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  const categoryId = req.params.id;
  const db = req.app.locals.db;

  const filter = { _id: new ObjectId(categoryId) };

  const categories = db.collection('categories');

  categories
    .deleteOne(filter)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(next);
});

router.get('/:id/cards', (req, res, next) => {
  const categoryId = req.params.id;
  const count = +(req.query.count || 10);
  const page = +(req.query.page || 1);

  const db = req.app.locals.db;
  const sliceFrom = (page - 1) * count;
  const sliceTo = sliceFrom + count;

  const filter = { _id: new ObjectId(categoryId) };
  const projection = { cards: { $slice: [sliceFrom, sliceTo] } };

  const categories = db.collection('categories');

  categories
    .findOne(filter, { projection })
    .then((result) => {
      if (!result) {
        const notFoundError = new Error(`Category with _id ${categoryId} not found`);
        notFoundError.status = 404;
        throw notFoundError;
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
    _id: new ObjectId(),
    categoryId: new ObjectId(categoryId),
    translation: req.body.translation,
    word: req.body.word,
    image: image ? `data:image/png;base64, ${image.buffer.toString('base64')}` : undefined,
    sound: sound ? `data:audio/mp3;base64, ${sound.buffer.toString('base64')}` : undefined,
  };

  const query = { _id: new ObjectId(categoryId) };
  const updateDocument = {
    $push: { cards: card }
  };

  const categories = db.collection('categories');
  categories
    .updateOne(query, updateDocument)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id/cards/:cardId', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'sound', maxCount: 1 }]), (req, res, next) => {
  const categoryId = req.params.id;
  const cardId = req.params.cardId;
  const translation = req.body.translation;
  const word = req.body.word;
  const image = req.files.image?.[0];
  const sound = req.files.sound?.[0];
  const db = req.app.locals.db;

  const query = { _id: new ObjectId(categoryId), 'cards._id': new ObjectId(cardId) };
  const updateDocument = {
    $set: {}
  };

  if (translation) {
    updateDocument.$set['cards.$.translation'] = translation;
  }

  if (word) {
    updateDocument.$set['cards.$.word'] = word;
  }

  if (image) {
    updateDocument.$set['cards.$.image'] = `data:image/png;base64, ${image.buffer.toString('base64')}`;
  }

  if (sound) {
    updateDocument.$set['cards.$.sound'] = `data:audio/mp3;base64, ${sound.buffer.toString('base64')}`;
  }

  const categories = db.collection('categories');
  categories
    .updateOne(query, updateDocument)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
});

router.delete('/:id/cards/:cardId', (req, res, next) => {
  const categoryId = req.params.id;
  const cardId = req.params.cardId;
  const db = req.app.locals.db;

  const filter = { _id: new ObjectId(categoryId) };
  const updateDocument = { $pull: { cards: { _id: new ObjectId(cardId) } } };

  const categories = db.collection('categories');
  categories
    .updateOne(filter, updateDocument)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(next);
});

module.exports = router;
