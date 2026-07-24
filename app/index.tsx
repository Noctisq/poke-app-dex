import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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

const INITIAL_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";
const FULL_LIST_URL = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
const SKELETON_COUNT = 8;

function usePulse() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return opacity;
};

function useFilterPokemon(query: string): PokemonListItem[] {
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

function PokemonCardSkeleton() {
  const opacity = usePulse();

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.sprite, styles.skeletonBox, { opacity }]} />
      <Animated.View
        style={[styles.skeletonText, styles.skeletonBox, { opacity }]}
      />
    </View>
  );
}

export default function Index() {
  const router = useRouter();
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
  },
  footer: {
    paddingVertical: 16,
  },
  skeletonBox: {
    backgroundColor: "#d0d0d0",
    borderRadius: 8,
  },
  skeletonText: {
    width: 120,
    height: 16,
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
