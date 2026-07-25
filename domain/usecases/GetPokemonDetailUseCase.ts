import { PokemonDetail } from "@/domain/entities/Pokemon";
import { PokemonRepository } from "@/domain/repositories/PokemonRepository";

export class GetPokemonDetailUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute(id: string): Promise<PokemonDetail> {
    return this.pokemonRepository.getDetail(id);
  }
}
