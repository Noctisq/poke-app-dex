export function getPokemonId(url: string): string {
  const segments = url.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

export function getPokemonSpriteUrl(id: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}