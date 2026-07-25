import { toggleFavoriteId } from "@/domain/usecases/toggleFavoriteId";

describe("toggleFavoriteId", () => {
  it("adds the id when it is not present", () => {
    expect(toggleFavoriteId([], "25")).toEqual(["25"]);
    expect(toggleFavoriteId(["1"], "25")).toEqual(["1", "25"]);
  });

  it("removes the id when it is already present", () => {
    expect(toggleFavoriteId(["25"], "25")).toEqual([]);
    expect(toggleFavoriteId(["1", "25", "4"], "25")).toEqual(["1", "4"]);
  });

  it("does not mutate the original array", () => {
    const original = ["1"];
    toggleFavoriteId(original, "25");
    expect(original).toEqual(["1"]);
  });
});
