import { isValidMaterial, getMaterialTitle, MATERIAL_TITLES } from "./materialUtils";

describe("materialUtils", () => {
  it("validates allowed material categories", () => {
    expect(isValidMaterial("base")).toBe(true);
    expect(isValidMaterial("liqueur")).toBe(true);
    expect(isValidMaterial("alcohol")).toBe(true);
    expect(isValidMaterial("ingredient")).toBe(true);
    expect(isValidMaterial("ba")).toBe(false);
    expect(isValidMaterial("")).toBe(false);
    expect(isValidMaterial(null)).toBe(false);
    expect(isValidMaterial(undefined)).toBe(false);
  });

  it("returns correct titles by language", () => {
    expect(getMaterialTitle("base", "zh")).toBe("基酒");
    expect(getMaterialTitle("base", "en")).toBe("Base Spirits");
    expect(getMaterialTitle("ba", "zh")).toBe(null);
  });
});
