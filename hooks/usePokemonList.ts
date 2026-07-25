import { container } from "@/di/container";
import { PokemonSummary } from "@/domain/entities/Pokemon";
import { useEffect, useState } from "react";

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
      const page = await container.getPokemonListUseCase.execute(cursor);
      setPokemons(page.items);
      setNextCursor(page.nextCursor);
      setPreviousCursor(page.previousCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
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
