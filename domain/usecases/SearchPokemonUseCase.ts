import { PokemonSummary } from "@/domain/entities/Pokemon";
import { PokemonRepository } from "@/domain/repositories/PokemonRepository";

export class SearchPokemonUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(query: string): Promise<PokemonSummary[]> {
    const allPokemon = await this.pokemonRepository.getAllSummaries();
    const normalizedQuery = query.toLowerCase();
    return allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(normalizedQuery)
    );
  }
}
