import { container } from "@/di/container";
import { PokemonSummary } from "@/domain/entities/Pokemon";
import { useEffect, useState } from "react";

export default function usePokemonList() {
  const [pokemons, setPokemons] = useState<PokemonSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPage(cursor: string | null, isInitial: boolean) {
    try {
      const page = await container.getPokemonListUseCase.execute(cursor);
      setPokemons((prev) =>
        isInitial ? page.items : [...prev, ...page.items]
      );
      setNextCursor(page.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }

  useEffect(() => {
    loadPage(null, true);
  }, []);

  function loadMore() {
    if (loadingMore || !nextCursor) {
      return;
    }
    setLoadingMore(true);
    loadPage(nextCursor, false);
  }

  return { pokemons, loading, loadingMore, error, loadMore };
}
