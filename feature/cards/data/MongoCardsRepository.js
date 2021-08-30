import { ObjectId } from "mongodb";

export class MongoCardsRepository {
  constructor(mongoDbClient) {
    this._mongoDbClient = mongoDbClient;
  }

  async getList(
    categoryId,
    paging = { count: DEFAULT_COUNT, page: DEFAULT_PAGE }
  ) {
    const { count, page } = paging;

    const categories = this._getCollection();

    const sliceFrom = (page - 1) * count;
    const sliceTo = sliceFrom + count;

    const filter = { _id: new ObjectId(categoryId) };
    const projection = { cards: { $slice: [sliceFrom, sliceTo] } };

    const category = await categories.findOne(filter, { projection });

    if (!category) {
      throw new CategoryNotFoundError(categoryId);
    }

    return category.cards;
  }

  createItem(categoryId, createItemInput) {
    const { imageDataUri, soundDataUri, translation, word } = createItemInput;

    const card = {
      _id: new ObjectId(),
      categoryId: new ObjectId(categoryId),
      translation,
      word,
      image: imageDataUri,
      sound: soundDataUri,
    };

    const query = { _id: new ObjectId(categoryId) };
    const updateDocument = {
      $push: { cards: card },
    };

    const categories = this._getCollection();

    return categories.updateOne(query, updateDocument);
  }

  updateItem(categoryId, cardId, updateItemInput) {
    const query = {
      _id: new ObjectId(categoryId),
      "cards._id": new ObjectId(cardId),
    };

    const { imageDataUri, soundDataUri, translation, word } = updateItemInput;

    const updateDocument = {
      $set: {},
    };

    if (translation) {
      updateDocument.$set["cards.$.translation"] = translation;
    }

    if (word) {
      updateDocument.$set["cards.$.word"] = word;
    }

    if (imageDataUri) {
      updateDocument.$set["cards.$.image"] = imageDataUri;
    }

    if (soundDataUri) {
      updateDocument.$set["cards.$.sound"] = soundDataUri;
    }

    const categories = this._getCollection();

    return categories.updateOne(query, updateDocument);
  }

  deleteItem(categoryId, cardId) {
    const filter = { _id: new ObjectId(categoryId) };
    const updateDocument = { $pull: { cards: { _id: new ObjectId(cardId) } } };
    const categories = this._getCollection();
    return categories.updateOne(filter, updateDocument);
  }

  _getCollection() {
    return this._mongoDbClient.collection("categories");
  }
}
