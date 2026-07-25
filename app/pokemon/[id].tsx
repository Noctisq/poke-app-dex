import { useFavorites } from "@/context/FavoritesContext";
import usePokemonDetail from "@/hooks/usePokemonDetail";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export default function PokemonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pokemon, loading, error } = usePokemonDetail(id);
  const { isFavorite, toggleFavorite } = useFavorites();

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

  const favorite = isFavorite(id);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={{ uri: pokemon.spriteUrl ?? undefined }}
          style={styles.sprite}
          contentFit="contain"
        />
        <Pressable
          onPress={() => toggleFavorite(id)}
          hitSlop={8}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={favorite ? "star" : "star-outline"}
            size={22}
            color={favorite ? "#f5c518" : "#999"}
          />
        </Pressable>
      </View>

      <Text style={styles.name}>{pokemon.name}</Text>

      <View style={styles.typesRow}>
        {pokemon.types.map((type) => (
          <Text key={type} style={styles.typeBadge}>
            {type}
          </Text>
        ))}
      </View>

      <View style={styles.measurementsRow}>
        <Text>Altura: {pokemon.heightMeters.toFixed(1)} m</Text>
        <Text>Peso: {pokemon.weightKilograms.toFixed(1)} kg</Text>
      </View>

      <View style={styles.statsSection}>
        {pokemon.stats.map((stat) => (
          <View key={stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{stat.name}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
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
  headerRow: {
    flexDirection: "row",
    gap: 8,
  },
  favoriteButton: {
    marginLeft: "auto",
  },
});
