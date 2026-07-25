import { container } from "@/di/container";
import { PokemonDetail } from "@/domain/entities/Pokemon";
import { useEffect, useState } from "react";

export default function usePokemonDetail(id: string) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      try {
        const detail = await container.getPokemonDetailUseCase.execute(id);
        setPokemon(detail);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [id]);

  return { pokemon, loading, error };
}
