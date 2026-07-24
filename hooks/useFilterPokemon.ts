import { FULL_LIST_URL } from "@/constants/urls";
import { PokemonListItem, PokemonListResponse } from "@/types/pokemon";
import { useEffect, useState } from "react";

export default function useFilterPokemon(query: string): PokemonListItem[] {
  const [fullPokemonList, setPokemonFullList] = useState<PokemonListItem[]>([]);
  async function loadFullList(url: string) {
    try {

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de Pokémon");
      }
      
      const data: PokemonListResponse = await response.json();
      setPokemonFullList(data.results);
    } catch (err) {
      console.error("Error al obtener el listado completo de Pokémon:", err);
    }
  }
  
  useEffect(() => {
   loadFullList(FULL_LIST_URL);
  }, []);

  return fullPokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
}