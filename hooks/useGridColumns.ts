import { useWindowDimensions } from "react-native";

const GRID_PADDING = 32;
const GRID_GAP = 12;

function getNumColumns(width: number): number {
  if (width >= 900) return 5;
  if (width >= 700) return 4;
  if (width >= 500) return 3;
  return 2;
}

export default function useGridColumns() {
  const { width } = useWindowDimensions();
  const numColumns = getNumColumns(width);
  const itemWidth =
    (width - GRID_PADDING - GRID_GAP * (numColumns - 1)) / numColumns;

  return { numColumns, itemWidth, gap: GRID_GAP };
}
