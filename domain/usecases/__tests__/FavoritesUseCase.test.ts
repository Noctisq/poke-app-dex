import { FavoritesRepository } from "@/domain/repositories/FavoritesRepository";
import { FavoritesUseCase } from "@/domain/usecases/FavoritesUseCase";

class FakeFavoritesRepository implements FavoritesRepository {
  saved: string[] | null = null;

  getFavoriteIds(): Promise<string[]> {
    return Promise.resolve(["1"]);
  }

  saveFavoriteIds(ids: string[]): Promise<void> {
    this.saved = ids;
    return Promise.resolve();
  }
}

describe("FavoritesUseCase", () => {
  it("getFavorites delegates to the repository", async () => {
    const repository = new FakeFavoritesRepository();
    const useCase = new FavoritesUseCase(repository);

    await expect(useCase.getFavorites()).resolves.toEqual(["1"]);
  });

  it("toggleFavorite adds a new id and persists it", async () => {
    const repository = new FakeFavoritesRepository();
    const useCase = new FavoritesUseCase(repository);

    const result = await useCase.toggleFavorite("25", ["1"]);

    expect(result).toEqual(["1", "25"]);
    expect(repository.saved).toEqual(["1", "25"]);
  });

  it("toggleFavorite removes an existing id and persists it", async () => {
    const repository = new FakeFavoritesRepository();
    const useCase = new FavoritesUseCase(repository);

    const result = await useCase.toggleFavorite("1", ["1", "25"]);

    expect(result).toEqual(["25"]);
    expect(repository.saved).toEqual(["25"]);
  });
});
