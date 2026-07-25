import { PokemonPage, PokemonRepository } from "@/domain/repositories/PokemonRepository";

export class GetPokemonListUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute(cursor?: string | null): Promise<PokemonPage> {
    return this.pokemonRepository.getList(cursor);
  }
}
