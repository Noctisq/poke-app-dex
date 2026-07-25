import { PokemonDetail, PokemonSummary } from "@/domain/entities/Pokemon";
import {
  PokemonDetailResponseDto,
  PokemonListItemDto,
} from "@/data/dto/PokemonDto";

function getIdFromUrl(url: string): string {
  const segments = url.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

function getSpriteUrl(id: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function toPokemonSummary(dto: PokemonListItemDto): PokemonSummary {
  const id = getIdFromUrl(dto.url);
  return {
    id,
    name: dto.name,
    spriteUrl: getSpriteUrl(id),
  };
}

export function toPokemonDetail(dto: PokemonDetailResponseDto): PokemonDetail {
  return {
    id: String(dto.id),
    name: dto.name,
    heightMeters: dto.height / 10,
    weightKilograms: dto.weight / 10,
    types: dto.types.map(({ type }) => type.name),
    stats: dto.stats.map(({ stat, base_stat }) => ({
      name: stat.name,
      value: base_stat,
    })),
    spriteUrl: dto.sprites.front_default,
  };
}
