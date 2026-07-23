import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

function getPokemonId(url: string): string {
  const segments = url.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

function getPokemonSpriteUrl(id: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export default function Index() {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
        );

        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de Pokémon");
        }

        const data: PokemonListResponse = await response.json();
        setPokemons(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={pokemons}
      keyExtractor={(pokemon) => getPokemonId(pokemon.url)}
      renderItem={({ item }) => {
        const id = getPokemonId(item.url);
        return (
          <View style={styles.card}>
            <Image
              source={{ uri: getPokemonSpriteUrl(id) }}
              style={styles.sprite}
              contentFit="contain"
            />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  sprite: {
    width: 48,
    height: 48,
  },
  name: {
    fontSize: 16,
    textTransform: "capitalize",
  },
});
