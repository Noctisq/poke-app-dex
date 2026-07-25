import { toggleFavoriteId } from "@/domain/usecases/toggleFavoriteId";
import { FavoritesRepository } from "@/domain/repositories/FavoritesRepository";

export class FavoritesUseCase {
  constructor(private readonly favoritesRepository: FavoritesRepository) {}

  getFavorites(): Promise<string[]> {
    return this.favoritesRepository.getFavoriteIds();
  }

  async toggleFavorite(id: string, currentFavorites: string[]): Promise<string[]> {
    const nextFavorites = toggleFavoriteId(currentFavorites, id);
    await this.favoritesRepository.saveFavoriteIds(nextFavorites);
    return nextFavorites;
  }
}
