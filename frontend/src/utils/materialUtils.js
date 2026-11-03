export const MATERIAL_TITLES = {
  base: { zh: "基酒", en: "Base Spirits" },
  liqueur: { zh: "利口酒", en: "Liqueurs" },
  alcohol: { zh: "其他酒類", en: "Other Alcohols" },
  ingredient: { zh: "其他成分", en: "Other Ingredients" },
};

export const isValidMaterial = (material) => {
  return Boolean(material && Object.prototype.hasOwnProperty.call(MATERIAL_TITLES, material));
};

export const getMaterialTitle = (material, lang = "zh") => {
  if (!isValidMaterial(material)) return null;
  return MATERIAL_TITLES[material][lang] || MATERIAL_TITLES[material].zh;
};
