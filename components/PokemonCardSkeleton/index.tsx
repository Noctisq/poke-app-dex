import usePulse from "@/hooks/usePulse";
import { Animated, View } from "react-native";
import styles from "./styles";

export default function PokemonCardSkeleton() {
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
