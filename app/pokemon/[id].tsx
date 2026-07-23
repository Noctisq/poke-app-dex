import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  sprites: {
    front_default: string | null;
  };
}

export default function PokemonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        if (!response.ok) {
          throw new Error("No se pudo obtener la información del Pokémon");
        }

        const data: PokemonDetailResponse = await response.json();
        setPokemon(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text>{error ?? "Pokémon no encontrado"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: pokemon.sprites.front_default ?? undefined }}
        style={styles.sprite}
        contentFit="contain"
      />
      <Text style={styles.name}>{pokemon.name}</Text>

      <View style={styles.typesRow}>
        {pokemon.types.map(({ type }) => (
          <Text key={type.name} style={styles.typeBadge}>
            {type.name}
          </Text>
        ))}
      </View>

      <View style={styles.measurementsRow}>
        <Text>Altura: {(pokemon.height / 10).toFixed(1)} m</Text>
        <Text>Peso: {(pokemon.weight / 10).toFixed(1)} kg</Text>
      </View>

      <View style={styles.statsSection}>
        {pokemon.stats.map(({ stat, base_stat }) => (
          <View key={stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{stat.name}</Text>
            <Text style={styles.statValue}>{base_stat}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sprite: {
    width: 160,
    height: 160,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  typesRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeBadge: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    textTransform: "capitalize",
  },
  measurementsRow: {
    flexDirection: "row",
    gap: 24,
  },
  statsSection: {
    width: "100%",
    marginTop: 12,
    gap: 6,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statName: {
    textTransform: "capitalize",
    color: "#555",
  },
  statValue: {
    fontWeight: "600",
  },
});
