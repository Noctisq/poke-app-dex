import { PokemonDetailResponseDto, PokemonListItemDto } from "@/data/dto/PokemonDto";
import { toPokemonDetail, toPokemonSummary } from "@/data/mappers/pokemonMapper";

describe("toPokemonSummary", () => {
  it("extracts the id from the PokeAPI url and builds the sprite url", () => {
    const dto: PokemonListItemDto = {
      name: "pikachu",
      url: "https://pokeapi.co/api/v2/pokemon/25/",
    };

    expect(toPokemonSummary(dto)).toEqual({
      id: "25",
      name: "pikachu",
      spriteUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    });
  });
});

describe("toPokemonDetail", () => {
  it("converts decimeters/hectograms to meters/kilograms and maps types and stats", () => {
    const dto: PokemonDetailResponseDto = {
      id: 25,
      name: "pikachu",
      height: 4,
      weight: 60,
      types: [{ type: { name: "electric" } }],
      stats: [{ base_stat: 35, stat: { name: "hp" } }],
      sprites: { front_default: "pikachu.png" },
    };

    expect(toPokemonDetail(dto)).toEqual({
      id: "25",
      name: "pikachu",
      heightMeters: 0.4,
      weightKilograms: 6,
      types: ["electric"],
      stats: [{ name: "hp", value: 35 }],
      spriteUrl: "pikachu.png",
    });
  });
});
