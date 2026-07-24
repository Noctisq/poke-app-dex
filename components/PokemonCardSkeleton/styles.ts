import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
  skeletonBox: {
    backgroundColor: "#d0d0d0",
    borderRadius: 8,
  },
  skeletonText: {
    width: 120,
    height: 16,
  },
});

export default styles;