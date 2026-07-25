import { BORDER_COLOR, SURFACE } from "@/constants/theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: SURFACE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  sprite: {
    width: "70%",
    aspectRatio: 1,
    marginTop: 12,
  },
  skeletonBox: {
    backgroundColor: "#5a5a5a",
    borderRadius: 4,
  },
  skeletonText: {
    width: "60%",
    height: 14,
    marginTop: 8,
    marginBottom: 4,
  },
});

export default styles;
