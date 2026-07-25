import { PokemonDetail, PokemonSummary } from "@/domain/entities/Pokemon";

export interface PokemonPage {
  items: PokemonSummary[];
  nextCursor: string | null;
  previousCursor: string | null;
}

export interface PokemonRepository {
  getList(cursor?: string | null): Promise<PokemonPage>;
  getAllSummaries(): Promise<PokemonSummary[]>;
  getDetail(id: string): Promise<PokemonDetail>;
}
