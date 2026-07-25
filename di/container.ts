import { PokeApiDataSource } from "@/data/datasources/PokeApiDataSource";
import { AsyncStorageFavoritesRepository } from "@/data/repositories/AsyncStorageFavoritesRepository";
import { PokeApiPokemonRepository } from "@/data/repositories/PokeApiPokemonRepository";
import { FavoritesRepository } from "@/domain/repositories/FavoritesRepository";
import { PokemonRepository } from "@/domain/repositories/PokemonRepository";
import { FavoritesUseCase } from "@/domain/usecases/FavoritesUseCase";
import { GetPokemonDetailUseCase } from "@/domain/usecases/GetPokemonDetailUseCase";
import { GetPokemonListUseCase } from "@/domain/usecases/GetPokemonListUseCase";
import { SearchPokemonUseCase } from "@/domain/usecases/SearchPokemonUseCase";

const pokeApiDataSource = new PokeApiDataSource();
const pokemonRepository: PokemonRepository = new PokeApiPokemonRepository(
  pokeApiDataSource
);
const favoritesRepository: FavoritesRepository =
  new AsyncStorageFavoritesRepository();

export const container = {
  getPokemonListUseCase: new GetPokemonListUseCase(pokemonRepository),
  searchPokemonUseCase: new SearchPokemonUseCase(pokemonRepository),
  getPokemonDetailUseCase: new GetPokemonDetailUseCase(pokemonRepository),
  favoritesUseCase: new FavoritesUseCase(favoritesRepository),
};
