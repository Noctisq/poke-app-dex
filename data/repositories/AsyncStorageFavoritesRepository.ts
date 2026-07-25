import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoritesRepository } from "@/domain/repositories/FavoritesRepository";

const FAVORITES_STORAGE_KEY = "favorites";

export class AsyncStorageFavoritesRepository implements FavoritesRepository {
  async getFavoriteIds(): Promise<string[]> {
    const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async saveFavoriteIds(ids: string[]): Promise<void> {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  }
}
