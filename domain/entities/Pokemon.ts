export interface PokemonSummary {
  id: string;
  name: string;
  spriteUrl: string;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonDetail {
  id: string;
  name: string;
  heightMeters: number;
  weightKilograms: number;
  types: string[];
  stats: PokemonStat[];
  spriteUrl: string | null;
}
