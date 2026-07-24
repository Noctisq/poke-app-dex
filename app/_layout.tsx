import { FavoritesProvider } from "@/context/FavoritesContext";
import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack />
    </FavoritesProvider>
  );
}
