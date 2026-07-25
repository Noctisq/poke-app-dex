import { container } from "@/di/container";
import { PokemonSummary } from "@/domain/entities/Pokemon";
import { useEffect, useState } from "react";

export default function useFilterPokemon(query: string): PokemonSummary[] {
  const [filtered, setFiltered] = useState<PokemonSummary[]>([]);

  useEffect(() => {
    let cancelled = false;

    container.searchPokemonUseCase.execute(query).then((result) => {
      if (!cancelled) {
        setFiltered(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return filtered;
}
