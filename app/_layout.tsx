import { POKEDEX_RED } from "@/constants/theme";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: POKEDEX_RED },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Pokédex" }} />
        <Stack.Screen name="pokemon/[id]" options={{ title: "Pokémon" }} />
      </Stack>
    </FavoritesProvider>
  );
}
