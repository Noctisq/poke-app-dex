import { container } from "@/di/container";
import { PokemonSummary } from "@/domain/entities/Pokemon";
import { useEffect, useState } from "react";

const MIN_LOADING_TIME_MS = 333;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function usePokemonList() {
  const [pokemons, setPokemons] = useState<PokemonSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [previousCursor, setPreviousCursor] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPage(cursor: string | null) {
    setLoading(true);
    setError(null);
    try {
      const [page] = await Promise.all([
        container.getPokemonListUseCase.execute(cursor),
        wait(MIN_LOADING_TIME_MS),
      ]);
      setPokemons(page.items);
      setNextCursor(page.nextCursor);
      setPreviousCursor(page.previousCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage(null);
  }, []);

  function goToNextPage() {
    if (!nextCursor) {
      return;
    }
    setPageNumber((page) => page + 1);
    loadPage(nextCursor);
  }

  function goToPreviousPage() {
    if (!previousCursor) {
      return;
    }
    setPageNumber((page) => page - 1);
    loadPage(previousCursor);
  }

  return {
    pokemons,
    loading,
    error,
    pageNumber,
    hasNextPage: !!nextCursor,
    hasPreviousPage: !!previousCursor,
    goToNextPage,
    goToPreviousPage,
  };
}
