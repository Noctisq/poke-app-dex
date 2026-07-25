import usePulse from "@/hooks/usePulse";
import { Animated, View } from "react-native";
import styles from "./styles";

interface PokemonCardSkeletonProps {
  width: number;
}

export default function PokemonCardSkeleton({ width }: PokemonCardSkeletonProps) {
  const opacity = usePulse();

  return (
    <View style={[styles.card, { width }]}>
      <Animated.View style={[styles.sprite, styles.skeletonBox, { opacity }]} />
      <Animated.View
        style={[styles.skeletonText, styles.skeletonBox, { opacity }]}
      />
    </View>
  );
}
