import { getPokemonTypeColor } from "@/constants/pokemonTypeColors";
import {
  ACCENT,
  BORDER_COLOR,
  SCREEN_BACKGROUND,
  SURFACE,
  SURFACE_ALT,
  TEXT_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/theme";
import { useFavorites } from "@/context/FavoritesContext";
import usePokemonDetail from "@/hooks/usePokemonDetail";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function PokemonDetail() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const { pokemon, loading, error } = usePokemonDetail(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const title = pokemon?.name ?? name;
    if (title) {
      navigation.setOptions({ title: capitalize(title) });
    }
  }, [pokemon, name, navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? "Pokémon not found"}
        </Text>
      </View>
    );
  }

  const favorite = isFavorite(id);
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.spriteCard}>
        <Pressable
          onPress={() => toggleFavorite(id)}
          hitSlop={8}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={favorite ? "star" : "star-outline"}
            size={24}
            color={favorite ? "#f5c518" : TEXT_MUTED}
          />
        </Pressable>
        <Image
          source={{ uri: pokemon.spriteUrl ?? undefined }}
          style={styles.sprite}
          contentFit="contain"
        />
      </View>

      <Text style={styles.pokedexNumber}>#{id.padStart(3, "0")}</Text>
      <Text style={styles.name}>{pokemon.name}</Text>

      <View style={styles.typesRow}>
        {pokemon.types.map((type) => (
          <Text
            key={type}
            style={[styles.typeBadge, { backgroundColor: getPokemonTypeColor(type) }]}
          >
            {type}
          </Text>
        ))}
      </View>

      <View style={styles.measurementsRow}>
        <View style={styles.measurementBox}>
          <Text style={styles.measurementLabel}>Height</Text>
          <Text style={styles.measurementValue}>
            {pokemon.heightMeters.toFixed(1)} m
          </Text>
        </View>
        <View style={styles.measurementBox}>
          <Text style={styles.measurementLabel}>Weight</Text>
          <Text style={styles.measurementValue}>
            {pokemon.weightKilograms.toFixed(1)} kg
          </Text>
        </View>
      </View>

      <View style={styles.statsTable}>
        <View style={[styles.statRow, styles.statHeaderRow]}>
          <Text style={styles.statHeaderText}>Stats</Text>
          <Text style={styles.statHeaderText}>Base</Text>
        </View>
        {pokemon.stats.map((stat, index) => (
          <View
            key={stat.name}
            style={[
              styles.statRow,
              { backgroundColor: index % 2 === 0 ? SURFACE : SURFACE_ALT },
            ]}
          >
            <Text style={styles.statName}>
              {STAT_LABELS[stat.name] ?? stat.name}
            </Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
        <View style={[styles.statRow, styles.totalRow]}>
          <Text style={styles.statTotalLabel}>Total</Text>
          <Text style={styles.statTotalValue}>{totalStats}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND,
  },
  container: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: SCREEN_BACKGROUND,
  },
  errorText: {
    color: TEXT_PRIMARY,
  },
  spriteCard: {
    width: "100%",
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  sprite: {
    width: 160,
    height: 160,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  pokedexNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_MUTED,
    marginTop: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: TEXT_PRIMARY,
  },
  typesRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeBadge: {
    color: "#fff",
    fontWeight: "600",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    textTransform: "capitalize",
    overflow: "hidden",
  },
  measurementsRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  measurementBox: {
    alignItems: "center",
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  measurementLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
    color: TEXT_PRIMARY,
  },
  statsTable: {
    width: "100%",
    maxWidth: 260,
    marginTop: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 4,
    overflow: "hidden",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statHeaderRow: {
    backgroundColor: ACCENT,
  },
  statHeaderText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  totalRow: {
    backgroundColor: ACCENT,
  },
  statName: {
    color: TEXT_SECONDARY,
    fontSize: 13,
  },
  statValue: {
    color: TEXT_PRIMARY,
    fontWeight: "600",
    fontSize: 13,
  },
  statTotalLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  statTotalValue: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
