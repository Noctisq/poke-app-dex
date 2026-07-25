import PokemonCardSkeleton from "@/components/PokemonCardSkeleton";
import { SKELETON_COUNT } from "@/constants/genericNumbers";
import {
  BORDER_COLOR,
  CARD_BACKGROUND,
  POKEDEX_RED,
  SCREEN_BACKGROUND,
} from "@/constants/theme";
import { useFavorites } from "@/context/FavoritesContext";
import useFilterPokemon from "@/hooks/useFilterPokemon";
import useGridColumns from "@/hooks/useGridColumns";
import usePokemonList from "@/hooks/usePokemonList";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    pokemons,
    loading,
    error,
    pageNumber,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = usePokemonList();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPokemons = useFilterPokemon(searchQuery);
  const { numColumns, itemWidth, gap } = useGridColumns();
  const isSearching = searchQuery.length > 0;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.grid, { gap }]}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <PokemonCardSkeleton key={index} width={itemWidth} />
          ))}
        </View>
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar Pokémon..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        key={`${numColumns}-${pageNumber}`}
        style={styles.flatList}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={{ gap }}
        numColumns={numColumns}
        data={isSearching ? filteredPokemons : pokemons}
        keyExtractor={(pokemon) => pokemon.id}
        renderItem={({ item }) => {
          const favorite = isFavorite(item.id);
          return (
            <Pressable
              style={[styles.card, { width: itemWidth, marginBottom: gap }]}
              onPress={() =>
                router.push({
                  pathname: "/pokemon/[id]",
                  params: { id: item.id, name: item.name },
                })
              }
            >
              <Text style={styles.pokedexNumber}>
                #{item.id.padStart(3, "0")}
              </Text>
              <Pressable
                onPress={() => toggleFavorite(item.id)}
                hitSlop={8}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={favorite ? "star" : "star-outline"}
                  size={20}
                  color={favorite ? "#f5c518" : "#999"}
                />
              </Pressable>
              <Image
                source={{ uri: item.spriteUrl }}
                style={styles.sprite}
                contentFit="contain"
              />
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
      {!isSearching && (
        <View style={styles.pagination}>
          <Pressable
            style={[
              styles.pageButton,
              !hasPreviousPage && styles.pageButtonDisabled,
            ]}
            onPress={goToPreviousPage}
            disabled={!hasPreviousPage}
          >
            <Ionicons name="chevron-back" size={18} color="#fff" />
            <Text style={styles.pageButtonText}>Anterior</Text>
          </Pressable>
          <Text style={styles.pageNumber}>Página {pageNumber}</Text>
          <Pressable
            style={[
              styles.pageButton,
              !hasNextPage && styles.pageButtonDisabled,
            ]}
            onPress={goToNextPage}
            disabled={!hasNextPage}
          >
            <Text style={styles.pageButtonText}>Siguiente</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: SCREEN_BACKGROUND,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
  },
  gridContent: {
    padding: 16,
  },
  card: {
    alignItems: "center",
    backgroundColor: CARD_BACKGROUND,
    borderColor: BORDER_COLOR,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  pokedexNumber: {
    position: "absolute",
    top: 6,
    left: 8,
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
  },
  favoriteButton: {
    position: "absolute",
    top: 4,
    right: 4,
    padding: 4,
  },
  sprite: {
    width: "70%",
    aspectRatio: 1,
    marginTop: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
    marginTop: 4,
  },
  input: {
    height: 44,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderColor: POKEDEX_RED,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: CARD_BACKGROUND,
  },
  flatList: {
    flex: 1,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: CARD_BACKGROUND,
    borderTopWidth: 2,
    borderTopColor: BORDER_COLOR,
  },
  pageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: POKEDEX_RED,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  pageButtonDisabled: {
    backgroundColor: "#ccc",
  },
  pageButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  pageNumber: {
    fontWeight: "600",
    color: "#555",
  },
});
