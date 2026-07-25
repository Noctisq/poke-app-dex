import { CARD_BACKGROUND, POKEDEX_RED, SCREEN_BACKGROUND } from "@/constants/theme";
import { getPokemonTypeColor } from "@/constants/pokemonTypeColors";
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

const STAT_BAR_MAX = 200;

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
        <ActivityIndicator size="large" color={POKEDEX_RED} />
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
  const primaryColor = getPokemonTypeColor(pokemon.types[0]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={[styles.spriteCard, { backgroundColor: `${primaryColor}33` }]}>
        <Pressable
          onPress={() => toggleFavorite(id)}
          hitSlop={8}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={favorite ? "star" : "star-outline"}
            size={24}
            color={favorite ? "#f5c518" : "#999"}
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
          <Text style={styles.measurementLabel}>Altura</Text>
          <Text style={styles.measurementValue}>
            {pokemon.heightMeters.toFixed(1)} m
          </Text>
        </View>
        <View style={styles.measurementBox}>
          <Text style={styles.measurementLabel}>Peso</Text>
          <Text style={styles.measurementValue}>
            {pokemon.weightKilograms.toFixed(1)} kg
          </Text>
        </View>
      </View>

      <View style={styles.statsSection}>
        {pokemon.stats.map((stat) => (
          <View key={stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{stat.name}</Text>
            <View style={styles.statBarTrack}>
              <View
                style={[
                  styles.statBarFill,
                  {
                    width: `${Math.min(100, (stat.value / STAT_BAR_MAX) * 100)}%`,
                    backgroundColor: primaryColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
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
  spriteCard: {
    width: "100%",
    borderRadius: 16,
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
    color: "#888",
    marginTop: 8,
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
    color: "#fff",
    fontWeight: "600",
    borderRadius: 12,
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
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  measurementLabel: {
    fontSize: 12,
    color: "#888",
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  statsSection: {
    width: "100%",
    marginTop: 16,
    gap: 10,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statName: {
    width: 70,
    textTransform: "capitalize",
    color: "#555",
    fontSize: 13,
  },
  statBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  statValue: {
    width: 32,
    textAlign: "right",
    fontWeight: "600",
    fontSize: 13,
  },
});
