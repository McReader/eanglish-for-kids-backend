import { ObjectId } from "mongodb";

export class MongoCategoriesRepository {
  constructor(mongoDbClient) {
    this._mongoDbClient = mongoDbClient;
  }

  getList(paging = { count: DEFAULT_COUNT, page: DEFAULT_PAGE }) {
    const categories = this._getCollection();
    const { count, page } = paging;

    const pipeline = [
      {
        $project: {
          name: 1,
          cardsCount: {
            $cond: {
              if: { $isArray: "$cards" },
              then: { $size: "$cards" },
              else: "NA",
            },
          },
        },
      },
    ];

    return categories
      .aggregate(pipeline)
      .skip(count * (page - 1))
      .limit(count)
      .toArray();
  }

  createItem(createCategoryInput) {
    const categories = this._getCollection();
    return categories.insertOne(createCategoryInput);
  }

  updateItem(categoryId, updateCategoryInput) {
    const categories = this._getCollection();
    const { name } = updateCategoryInput;
    const filter = { _id: new ObjectId(categoryId) };
    const updateDocument = { $set: { name } };
    return categories.updateOne(filter, updateDocument);
  }

  deleteItem(categoryId) {
    const categories = this._getCollection();
    const filter = { _id: new ObjectId(categoryId) };
    return categories.deleteOne(filter);
  }

  _getCollection() {
    return this._mongoDbClient.collection("categories");
  }
}
