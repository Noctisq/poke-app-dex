import {
  PokemonDetailResponseDto,
  PokemonListResponseDto,
} from "@/data/dto/PokemonDto";

export class PokeApiDataSource {
  async fetchList(url: string): Promise<PokemonListResponseDto> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("No se pudo obtener la lista de Pokémon");
    }
    return response.json();
  }

  async fetchDetail(id: string): Promise<PokemonDetailResponseDto> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error("No se pudo obtener la información del Pokémon");
    }
    return response.json();
  }
}
