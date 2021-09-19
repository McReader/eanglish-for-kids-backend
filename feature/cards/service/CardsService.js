import FileUtils from "../../../shared/FileUtils";

export class CardsService {
  constructor(cardsRepository) {
    this._repository = cardsRepository;
  }

  createItem(categoryId, createItemInput) {
    const { image, sound, translation, word } = createItemInput;

    const createCardRepoInput = {
      imageDataUri: image ? FileUtils.toDataUrl(image) : undefined,
      soundDataUrl: sound ? FileUtils.toDataUrl(sound) : undefined,
      translation,
      word,
    };

    return this.repository.createItem(categoryId, createCardRepoInput);
  }

  updateItem(categoryId, cardId, updateItemInput) {
    const { image, sound, translation, word } = updateItemInput;

    const updateCardRepoInput = {
      imageDataUri: image ? FileUtils.toDataUrl(image) : undefined,
      soundDataUrl: sound ? FileUtils.toDataUrl(sound) : undefined,
      translation,
      word,
    };

    return this.repository.updateItem(categoryId, cardId, updateCardRepoInput);
  }

  get repository() {
    return this._repository;
  }
}
