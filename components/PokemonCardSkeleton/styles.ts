import { BORDER_COLOR, CARD_BACKGROUND } from "@/constants/theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: CARD_BACKGROUND,
    borderColor: BORDER_COLOR,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  sprite: {
    width: "70%",
    aspectRatio: 1,
    marginTop: 12,
  },
  skeletonBox: {
    backgroundColor: "#d0d0d0",
    borderRadius: 8,
  },
  skeletonText: {
    width: "60%",
    height: 14,
    marginTop: 8,
    marginBottom: 4,
  },
});

export default styles;
