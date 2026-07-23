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
    <FlatList
      style={styles.container}
      data={pokemons}
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
});
