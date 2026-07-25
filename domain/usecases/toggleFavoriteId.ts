export function toggleFavoriteId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((favoriteId) => favoriteId !== id) : [...ids, id];
}
