import PokemonCardSkeleton from "@/components/PokemonCardSkeleton";
import { SKELETON_COUNT } from "@/constants/genericNumbers";
import { INITIAL_URL } from "@/constants/urls";
import { useFavorites } from "@/context/FavoritesContext";
import useFilterPokemon from "@/hooks/useFilterPokemon";
import { PokemonListItem, PokemonListResponse } from "@/types/pokemon";
import { getPokemonId, getPokemonSpriteUrl } from "@/utils/pokemonUtils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(INITIAL_URL);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPokemons = useFilterPokemon(searchQuery);

  async function loadPage(url: string, isInitial: boolean) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de Pokémon");
      }

      const data: PokemonListResponse = await response.json();
      
      setPokemons((prev) =>
        isInitial ? data.results : [...prev, ...data.results]
      );

      setNextUrl(data.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }



  useEffect(() => {
    loadPage(INITIAL_URL, true);
  }, []);


  
  function handleLoadMore() {
    if (loadingMore || !nextUrl) {
      return;
    }
    setLoadingMore(true);
    loadPage(nextUrl, false);
  }

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
        keyExtractor={(pokemon) => getPokemonId(pokemon.url)}
        renderItem={({ item }) => {
          const id = getPokemonId(item.url);
          const favorite = isFavorite(id);
          return (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({ pathname: "/pokemon/[id]", params: { id } })
              }
            >
              <Image
                source={{ uri: getPokemonSpriteUrl(id) }}
                style={styles.sprite}
                contentFit="contain"
              />
              <Text style={styles.name}>{item.name}</Text>
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
            </Pressable>
          );
        }}
        onEndReached={handleLoadMore}
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
