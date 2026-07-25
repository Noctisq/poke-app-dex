import {
  PokemonDetailResponseDto,
  PokemonListResponseDto,
} from "@/data/dto/PokemonDto";

export class PokeApiDataSource {
  async fetchList(url: string): Promise<PokemonListResponseDto> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Could not fetch the Pokémon list");
    }
    return response.json();
  }

  async fetchDetail(id: string): Promise<PokemonDetailResponseDto> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error("Could not fetch the Pokémon details");
    }
    return response.json();
  }
}
