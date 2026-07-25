export interface FavoritesRepository {
  getFavoriteIds(): Promise<string[]>;
  saveFavoriteIds(ids: string[]): Promise<void>;
}
