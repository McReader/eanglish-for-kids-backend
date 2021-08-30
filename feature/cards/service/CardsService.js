export class CardsService {
  constructor(cardsRepository) {
    this._repository = cardsRepository;
  }

  createItem(categoryId, createItemInput) {
    const { image, sound, translation, word } = createItemInput;

    const createCardRepoInput = {
      imageDataUri: image
        ? `data:image/png;base64, ${image.buffer.toString("base64")}`
        : undefined,
      soundDataUrl: sound
        ? `data:audio/mp3;base64, ${sound.buffer.toString("base64")}`
        : undefined,
      translation: translation,
      word: word,
    };

    return this.repository.createItem(categoryId, createCardRepoInput);
  }

  updateItem(categoryId, cardId, updateItemInput) {
    const { image, sound, translation, word } = updateItemInput;

    const updateCardRepoInput = {
      imageDataUri: image
        ? `data:image/png;base64, ${image.buffer.toString("base64")}`
        : undefined,
      soundDataUrl: sound
        ? `data:audio/mp3;base64, ${sound.buffer.toString("base64")}`
        : undefined,
      translation: translation,
      word: word,
    };

    return this.repository.updateItem(categoryId, cardId, updateCardRepoInput);
  }

  get repository() {
    return this._repository;
  }
}
