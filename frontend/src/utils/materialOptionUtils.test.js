import { buildMaterialOptions } from "./materialOptionUtils";

describe("buildMaterialOptions", () => {
  const materials = [
    { id: 1, chinese_name: "蘭姆酒", english_name: "Goslings Rum" },
    { id: 2, chinese_name: "蘭姆酒", english_name: "Gold Jamaican Rum" },
    { id: 3, chinese_name: "白蘭姆酒", english_name: "White Rum" },
  ];

  it("adds English names only when Chinese labels collide", () => {
    expect(buildMaterialOptions(materials, true)).toEqual([
      { value: 1, label: "蘭姆酒 (Goslings Rum)" },
      { value: 2, label: "蘭姆酒 (Gold Jamaican Rum)" },
      { value: 3, label: "白蘭姆酒" },
    ]);
  });

  it("uses Chinese names to disambiguate duplicate English labels", () => {
    const duplicateEnglishNames = [
      { id: 1, chinese_name: "老湯姆琴酒", english_name: "Gin" },
      { id: 2, chinese_name: "琴酒", english_name: "Gin" },
    ];

    expect(buildMaterialOptions(duplicateEnglishNames, false)).toEqual([
      { value: 1, label: "Gin (老湯姆琴酒)" },
      { value: 2, label: "Gin (琴酒)" },
    ]);
  });
});
