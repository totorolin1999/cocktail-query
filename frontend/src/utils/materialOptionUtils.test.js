import { buildMaterialOptions } from "./materialOptionUtils";

describe("buildMaterialOptions", () => {
  const materials = [
    { id: 1, Chinese_Name: "蘭姆酒", English_Name: "Goslings Rum" },
    { id: 2, Chinese_Name: "蘭姆酒", English_Name: "Gold Jamaican Rum" },
    { id: 3, Chinese_Name: "白蘭姆酒", English_Name: "White Rum" },
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
      { id: 1, Chinese_Name: "老湯姆琴酒", English_Name: "Gin" },
      { id: 2, Chinese_Name: "琴酒", English_Name: "Gin" },
    ];

    expect(buildMaterialOptions(duplicateEnglishNames, false)).toEqual([
      { value: 1, label: "Gin (老湯姆琴酒)" },
      { value: 2, label: "Gin (琴酒)" },
    ]);
  });
});
