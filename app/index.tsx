import PokemonCardSkeleton from "@/components/PokemonCardSkeleton";
import { SKELETON_COUNT } from "@/constants/genericNumbers";
import { useFavorites } from "@/context/FavoritesContext";
import useFilterPokemon from "@/hooks/useFilterPokemon";
import usePokemonList from "@/hooks/usePokemonList";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

export default function Index() {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { pokemons, loading, loadingMore, error, loadMore } = usePokemonList();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPokemons = useFilterPokemon(searchQuery);

  if (loading) {
    return (
      <View style={styles.container}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <PokemonCardSkeleton key={index} />
        ))}
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
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        style={styles.flatList}
        data={searchQuery ? filteredPokemons : pokemons}
        keyExtractor={(pokemon) => pokemon.id}
        renderItem={({ item }) => {
          const favorite = isFavorite(item.id);
          return (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/pokemon/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Image
                source={{ uri: item.spriteUrl }}
                style={styles.sprite}
                contentFit="contain"
              />
              <Text style={styles.name}>{item.name}</Text>
              <Pressable
                onPress={() => toggleFavorite(item.id)}
                hitSlop={8}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={favorite ? "star" : "star-outline"}
                  size={22}
                  color={favorite ? "#f5c518" : "#999"}
                />
              </Pressable>
            </Pressable>
          );
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footer} size="small" />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  sprite: {
    width: 48,
    height: 48,
  },
  name: {
    fontSize: 16,
    textTransform: "capitalize",
    flex: 1,
  },
  favoriteButton: {
    marginLeft: "auto",
  },
  footer: {
    paddingVertical: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  flatList: {
    flex: 1,
  },
});
