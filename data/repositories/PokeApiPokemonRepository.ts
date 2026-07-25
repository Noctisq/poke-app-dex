import { FULL_LIST_URL, INITIAL_URL } from "@/constants/urls";
import { PokeApiDataSource } from "@/data/datasources/PokeApiDataSource";
import { toPokemonDetail, toPokemonSummary } from "@/data/mappers/pokemonMapper";
import { PokemonDetail, PokemonSummary } from "@/domain/entities/Pokemon";
import {
  PokemonPage,
  PokemonRepository,
} from "@/domain/repositories/PokemonRepository";

export class PokeApiPokemonRepository implements PokemonRepository {
  private allSummariesCache: PokemonSummary[] | null = null;

  constructor(private readonly dataSource: PokeApiDataSource) {}

  async getList(cursor?: string | null): Promise<PokemonPage> {
    const data = await this.dataSource.fetchList(cursor ?? INITIAL_URL);
    return {
      items: data.results.map(toPokemonSummary),
      nextCursor: data.next,
      previousCursor: data.previous,
    };
  }

  async getAllSummaries(): Promise<PokemonSummary[]> {
    if (!this.allSummariesCache) {
      const data = await this.dataSource.fetchList(FULL_LIST_URL);
      this.allSummariesCache = data.results.map(toPokemonSummary);
    }
    return this.allSummariesCache;
  }

  async getDetail(id: string): Promise<PokemonDetail> {
    const data = await this.dataSource.fetchDetail(id);
    return toPokemonDetail(data);
  }
}
