export class CategoriesService {
  constructor(categoriesRepo) {
    this._repository = categoriesRepo;
  }

  get repository() {
    return this._repository;
  }
}
