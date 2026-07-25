export interface PokemonListItemDto {
  name: string;
  url: string;
}

export interface PokemonListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItemDto[];
}

export interface PokemonTypeDto {
  type: {
    name: string;
  };
}

export interface PokemonStatDto {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonDetailResponseDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonTypeDto[];
  stats: PokemonStatDto[];
  sprites: {
    front_default: string | null;
  };
}
