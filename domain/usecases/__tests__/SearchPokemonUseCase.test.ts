import { PokemonSummary } from "@/domain/entities/Pokemon";
import {
  PokemonPage,
  PokemonRepository,
} from "@/domain/repositories/PokemonRepository";
import { SearchPokemonUseCase } from "@/domain/usecases/SearchPokemonUseCase";

const allPokemon: PokemonSummary[] = [
  { id: "25", name: "pikachu", spriteUrl: "pikachu.png" },
  { id: "26", name: "raichu", spriteUrl: "raichu.png" },
  { id: "1", name: "bulbasaur", spriteUrl: "bulbasaur.png" },
];

class FakePokemonRepository implements PokemonRepository {
  getList(): Promise<PokemonPage> {
    throw new Error("not used in this test");
  }
  getAllSummaries(): Promise<PokemonSummary[]> {
    return Promise.resolve(allPokemon);
  }
  getDetail(): Promise<never> {
    throw new Error("not used in this test");
  }
}

describe("SearchPokemonUseCase", () => {
  it("filters by substring, case-insensitive", async () => {
    const useCase = new SearchPokemonUseCase(new FakePokemonRepository());

    const result = await useCase.execute("CHU");

    expect(result.map((p) => p.name)).toEqual(["pikachu", "raichu"]);
  });

  it("returns an empty array when nothing matches", async () => {
    const useCase = new SearchPokemonUseCase(new FakePokemonRepository());

    const result = await useCase.execute("zzz");

    expect(result).toEqual([]);
  });
});
